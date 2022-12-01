module Api
  class UserManagementService < BaseService
    FULL_ACCESS = 1
    VIEW_USER_MANAGEMENT = 2
    ADD_APPROVER = 3
    ADD_REVIEWER = 4
    FULL_ACCESS_MY_COMPANY = 5
    DASHBOARD_FULL_ACCESS = 20
    DASHBOARD_FULL_ACCESS_MY_COMPANY = 21
    DASHBOARD_FULL_ACCESS_MY_PROJECT = 23
    def initialize(params, current_user)
      groups = Group.joins(:user_group).where(user_groups: { user_id: current_user.id })
      privilege_array = []
      groups.each do |group|
        privilege_array += group&.list_privileges
      end
      @privilege_array = privilege_array
      @current_user = current_user
      @params = params
    end

    def format_user_data(users)
      datas = []
      users[0]&.email # anti-crash code (bug rails)
      projects = Project.distinct.select(:id, "project_members.user_id as user_id", :is_managent, :name).joins(:project_members).where(project_members: { user_id: users.pluck(:id) }).order(:name)
      h_projects = {}
      projects.map do |project|
        if h_projects[project.user_id].nil?
          h_projects[project.user_id] = {
            id: [],
            name: [],
          }
        end
        h_projects[project.user_id][:name] << project.name
        h_projects[project.user_id][:id] << project.id
      end

      full_access = (privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any?
      current_projects = ProjectMember.where(user_id: current_user.id).pluck(:project_id)

      users.map.with_index do |user, index|
        if h_projects[user.id].present? && (current_projects & h_projects[user.id][:id]).any?
          is_approver = privilege_array.include?(ADD_APPROVER)
          is_reviewer = privilege_array.include?(ADD_REVIEWER)
        end

        current_user_data = []
        current_user_data.push("<td class='selectable'><div class='resource_selection_cell'><input type='checkbox' id='batch_action_item_#{user.id}' value='0' class='collection-selection' name='collection_selection[]'></div></td>")

        number = params[:offset] + index + 1
        current_user_data.push("<p class='number'>#{number}</p>")
        current_user_data.push("<a href='/users/user_profile?id=#{user.id}' title='View Contact Detail'>#{user.format_name_vietnamese}</a>")
        current_user_data.push(user&.email || "")
        current_user_data.push(user.account)

        current_user_data.push(user.role&.name || "")
        current_user_data.push(user.title&.name || "")
        project_name = h_projects[user.id].present? ? h_projects[user.id][:name].join(", ") : ""
        current_user_data.push(project_name)
        current_user_data.push(user.company.name)
        # column action
        current_user_data.push("<div style='text-align: center'>
            <a class='action_icon edit_icon' title='Edit user information' data-user_id='#{user.id}' href='javascript:;'>
              <i class='fa fa-pencil icon' style='color: #{full_access ? "#fc9803" : "grey"}'></i>
            </a>
              <a class='action_icon add-reviewer-icon'  title='Add Reviewer For User' #{(full_access || is_reviewer) ? "data-toggle='modal' data-target='#addReviewerModal' data-user_id='#{user.id}' data-user_account='#{user.format_name_vietnamese}'" : ""}  href='javascript:;'>
                <i border='0' class='fas fa-user-check add-reviewer-icon' style='color: #{full_access ? "#58c317" : "grey"}'></i>
              </a>
              <a class='action_icon add-approver-icon' title='Add Approver For User' #{(full_access || is_approver) ? "data-toggle='modal'  data-target='#addApproverModal' data-user_id='#{user.id}' data-user_account='#{user.format_name_vietnamese}'" : ""} href='javascript:;'>
                <i border='0' class='fas fa-user-tie add-approver-icon' style='color: #{full_access ? "black" : "grey"}'></i>
              </a>
              <a #{"class='action_icon status_icon'" if full_access} title='Disable/Enable User' data-user_id='#{user.id}' data-user_account='#{user.account}' href='javascript:;'>
                <i class='fa fa-toggle-#{user.status ? "on" : "off"}' style='margin-bottom: 0px; #{"color:grey" unless full_access}'></i>
              </a>&nbsp;
              <a class='action_icon reset-password' title='Reset password of user' data-user_id='#{user.id}' data-user_account='#{user.account}' data-user_full_name='#{user.format_name_vietnamese}' href='javascript:;'>
              <i border='0'  class='fas fa-unlock-alt reset-password-icon' style='color: #{full_access ? "#61066b" : "grey"}'></i>
              </a>
              <a class='action_icon delete_icon' title='Delete the user' data-toggle='modal' data-target='#deleteModal' data-user_id='#{user.id}' data-user_full_name='#{user.format_name_vietnamese}'  data-user_lastname='#{user.last_name}' href='javascript:;'>
                <i class='fa fa-trash icon' style='color: #{full_access ? "red" : "grey"}'></i>
              </a>
            </div>")

        datas << current_user_data
      end.flatten
      datas
    end

    def get_filter_company
      if params[:company_id] == "all"
        projects = Project.select(:id, :name).order(:name)
        roles = Role.select(:id, :name).order(:name)
      else
        projects = Project.select(:id, :name).where(company_id: params[:company_id]).order(:name)
        user_ids = User.where(company_id: params[:company_id], is_delete: false).pluck(:role_id).uniq
        roles = Role.select(:id, :name).where(id: user_ids).order(:name)
      end

      { projects: projects, roles: roles }
    end

    def get_filter_project
      filter = {
        is_delete: false,
      }
      filter[:company_id] = params[:company_id] if params[:company_id] != "all"
      if params[:project_id] != "all" && params[:project_id] != "none"
        user_ids = ProjectMember.where(project_id: params[:project_id]).pluck(:user_id).uniq
        filter[:id] = user_ids
      end
      users = User.where(filter)
      if params[:project_id] == "none"
        user_ids = ProjectMember.pluck(:user_id).uniq
        users = users.where.not(id: user_ids).pluck(:role_id)
      end

      Role.select(:id, :name).where(id: users.pluck(:role_id)).order(:name)
    end

    def data_users_by_gender
      users = User.left_outer_joins(:project_members).where(filter_users).where.not(id: 1).group(:gender).count

      h_users = {}
      h_users[:Male] = users[true] if users[true]
      h_users[:Female] = users[false] if users[false]

      { data: h_users, total: users.values.sum }
    end

    def data_users_by_role
      if privilege_array.include? DASHBOARD_FULL_ACCESS
        h_users = User.left_outer_joins(:project_members, :role).where(filter_users).where.not(id: 1).group("roles.name").count
        h_users_small = User.left_outer_joins(:project_members, :role).where(filter_users).where.not(role_id: nil, id: 1).group("roles.abbreviation").count    
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_COMPANY
        filter_users2 = {}
        filter_users2[:company_id] = current_user.company_id if filter_users[:company_id].nil?
        h_users = User.left_outer_joins(:project_members, :role).where(filter_users).where(filter_users2).where.not(id: 1).group("roles.name").count
        h_users_small = User.left_outer_joins(:project_members, :role).where(filter_users).where(filter_users2).where.not(role_id: nil, id: 1).group("roles.abbreviation").count
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_PROJECT        
        filter_users2 = {}
        filter_users2[:company_id] = current_user.company_id if filter_users[:company_id].nil?
        filter_users2[:project_members] = {} if filter_users[:project_members].nil?
        filter_users2[:project_members][:project_id] = ProjectMember.where(user_id: current_user.id).includes(:project).pluck(:project_id).uniq if filter_users[:project_members].nil? || filter_users[:project_members][:project_id].nil?
        h_users = User.left_outer_joins(:project_members, :role).where(filter_users).where(filter_users2).where.not(id: 1).group("roles.name").count
        h_users_small = User.left_outer_joins(:project_members, :role).where(filter_users).where(filter_users2).where.not(role_id: nil, id: 1).group("roles.abbreviation").count    
      end

      { data: h_users, data_small: h_users_small, total: h_users.values.sum }
    end

    def edit_user_profile
      user = User.find_by(id: params[:id])
      return false if user.blank?
      return false unless user.update(user_params)
      true
    end

    def data_users_by_seniority
      users = User.left_outer_joins(:project_members).where(filter_users).where.not(id: 1).group("TIMESTAMPDIFF(YEAR, users.joined_date, NOW())").count
      h_users = { "<3" => 0, "3-5" => 0, "5-7" => 0, "7-10" => 0, ">10" => 0 }
      users.each do |key, value|
        case key
        when nil
          h_users["<3"] += value
        when 0...3
          h_users["<3"] += value
        when 3...5
          h_users["3-5"] += value
        when 5...7
          h_users["5-7"] += value
        when 7...10
          h_users["7-10"] += value
        else
          h_users[">10"] += value
        end
      end

      h_users.select { |key, value| value > 0 }
    end

    def calulate_data_user_by_seniority
      h_users = data_users_by_seniority
      list = ["<3", "3-5", "5-7", "7-10", ">10"]
      data = list.map do |i|
        next if h_users[i].nil?
        value = h_users[i] / 2.0
        { group: i, left: value, right: value }
      end.compact
      total = h_users.values.sum
      { data: data, total: total }
    end

    def data_users_by_title
      if params[:role_id] && params[:role_id].first != "All" && params[:role_id].length == 1
        users = User.left_outer_joins(:project_members, :title).where(filter_users).where.not(id: 1).group("titles.name").count
        h_users = {}
        users.each do |key, value|
          if key.nil?
            h_users["No Title"] = value
          else
            h_users[key] = value
          end
        end
        return h_users
      end

      users = User.left_outer_joins(:project_members, :title).where(filter_users).where.not(id: 1).group("titles.rank").count
      h_users = { "No Title" => 0, "Associate" => 0, "Middle" => 0, "Senior" => 0, "> Senior" => 0 }

      users.each do |key, value|
        case key
        when 1
          h_users["Associate"] = value
        when 2
          h_users["Middle"] = value
        when 3
          h_users["Senior"] = value
        when 4..20
          h_users["> Senior"] += value
        else
          h_users["No Title"] = value
        end
      end
      h_users.select { |key, value| value > 0 }
    end

    def data_career_chart(user_id = nil)
      has_cdp = false
      user_id ||= current_user.id
      title_histories = TitleHistory.joins(:period).where(user_id: user_id).where.not(id: 1).order("periods.to_date")
      h_rank_empty = {
        period: "",
        # current_user.role&.name => {
        #   rank: nil,
        #   level: nil,
        #   title: "",
        # },
      }
      role_names = title_histories.pluck(:role_name).uniq
      role_names.each do |role_name|
        h_rank_empty[role_name] = {
          rank: nil,
          level: nil,
          title: "",
        }
      end

      arr_result = []
      title_histories.each do |title_history|
        # new hash empty
        h_rank = h_rank_empty.clone
        h_rank[:period] = title_history.period&.format_period_career
        h_rank[title_history.role_name] = {
          rank: title_history.rank,
          level: title_history.level,
          title: title_history.title,
        }
        arr_result << h_rank
      end

      # add cds cdp
      form = Form.includes(:title, :role, :period).find_by(user_id: current_user.id)
      schedule = Schedule.find_by(company_id: current_user.company_id, status: "In-progress")

      if form.present? && schedule.present?
        data_result = Api::FormService.new(params, current_user).data_view_result(form.id)

        if form.status != "Done"
          h_rank = h_rank_empty.clone
          h_rank[:period] = schedule&.period&.format_period_career
          h_rank[:period] = "Next Period" if form.status == "New" && schedule&.period_id = title_histories.last&.period_id
          h_rank[form.role.name.to_sym] = {
            rank: data_result[:expected_title][:rank] || 0,
            level: data_result[:expected_title][:level] || 0,
            title: data_result[:expected_title][:title] || "",
          }
          arr_result << h_rank
        end

        if data_result[:cdp].present? && data_result[:cdp][:title_id].present?
          has_cdp = true
          h_rank = h_rank_empty.clone
          h_rank[:period] = "Next Period"
          h_rank[form.role.name.to_sym] = {
            rank: data_result[:cdp][:rank] || 0,
            level: data_result[:cdp][:level] || 0,
            title: data_result[:cdp][:title] || "",
          }
          arr_result << h_rank
        end
      end

      role_name_histories = title_histories.pluck(:role_name).uniq
      titles = Title.includes(:role,:level_mappings).where("roles.name": role_name_histories)
      hash = {}
      titles.group_by{|h| h[:rank]}.each{|_, v|
        v.each{|v1|
          lv = v1.level_mappings.max_by{|el| el[:level]}&.level
          hash[v1.rank] = lv if hash[v1.rank].nil? || hash[v1.rank] < lv
        }
      }
      
      title_histories.each{|title_history|
        hash[title_history.rank] = title_history.level if(hash[title_history.rank].nil? || hash[title_history.rank] < title_history.level)
      }
      { data: arr_result, has_cdp: has_cdp, level_mapping: hash }
    end

    def calulate_data_user_by_title
      h_users = data_users_by_title
      data = h_users.keys.map do |i|
        value = h_users[i] / 2.0
        { group: i, left: value, right: value }
      end
      total = h_users.values.sum
      { data: data, total: total }
    end

    def data_users_up_title
      schedules = Schedule.where(status: "Done",_type: "HR").or(Schedule.where(status: "Done",_type: nil)).order(end_date_hr: :desc)
      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end

      if privilege_array.include? DASHBOARD_FULL_ACCESS
        user_ids = User.left_outer_joins(:project_members).where(filter_users).where.not(id: 1).pluck(:id).uniq
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_COMPANY
        user_ids = User.left_outer_joins(:project_members).where(filter_users).where(company_id: current_user.company_id).where.not(id: 1).pluck(:id).uniq
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_PROJECT
        user_ids = User.left_outer_joins(:project_members).left_outer_joins(:approvers).where(filter_users).where(company_id: current_user.company_id,"project_members.project_id": ProjectMember.where(user_id: current_user.id).pluck(:project_id), id: Approver.where(approver_id: current_user.id, period_id: first[current_user.company_id]).pluck(:user_id)).where.not(id: 1).pluck(:id).uniq
      end
  
      title_first = TitleHistory.includes([:user, :period]).where(user_id: user_ids, period_id: first.values)
      title_second = TitleHistory.includes(:period).where(user_id: user_ids, period_id: second.values)

      h_old = {}
      title_second.map do |title|
        h_old[title.user_id] = {
          rank: title.rank,
          level: title.level,
          title: title.title,
          name: title&.period&.format_to_date,
          role_name: title&.role_name,
        }
      end
      results = []
      user_ids = []

      title_first.each_with_index do |title, i|
        prev_period = h_old[title.user_id]
        next if prev_period.present?  && (title.rank <= prev_period[:rank] || title&.role_name != prev_period[:role_name])
        data = {
          user_id: title.user_id,
          title_history_id: title.id,
          full_name: title.user.format_name_vietnamese,
          email: title.user.email,
          role: title.role_name,
          rank: title.rank,
          title: title.title,
          level: title.level,
        }
        data[:old_rank] = h_old[title.user_id] ? h_old[title.user_id][:rank] : "N/A"
        data[:old_title] = h_old[title.user_id] ? h_old[title.user_id][:title] : "N/A"
        data[:old_level] = h_old[title.user_id] ? h_old[title.user_id][:level] : "N/A"
        results << data
        user_ids << title.user_id
      end

      { data: results, user_ids: user_ids, period_id: first.values }
    end

    def data_users_down_title
      schedules = Schedule.includes(:period).where(status: "Done",_type: "HR").or(Schedule.includes(:period).where(status: "Done",_type: nil)).order("periods.to_date desc")

      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end

      if privilege_array.include? DASHBOARD_FULL_ACCESS
        user_ids = User.left_outer_joins(:project_members).where(filter_users).where.not(id: 1).pluck(:id).uniq
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_COMPANY
        user_ids = User.left_outer_joins(:project_members).where(filter_users).where(company_id: current_user.company_id).where.not(id: 1).pluck(:id).uniq
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_PROJECT
        user_ids = User.left_outer_joins(:project_members).left_outer_joins(:approvers).where(filter_users).where(company_id: current_user.company_id,"project_members.project_id": ProjectMember.where(user_id: current_user.id).pluck(:project_id), id: Approver.where(approver_id: current_user.id, period_id: first[current_user.company_id]).pluck(:user_id)).where.not(id: 1).pluck(:id).uniq
      end

      title_first = {}
      title_second = {}
      first.each { |company_id, period_id| title_first[company_id] = TitleHistory.includes(:user).where(user_id: user_ids, period_id: period_id) }
      second.each { |company_id, period_id| title_second[company_id] = TitleHistory.where(user_id: user_ids, period_id: period_id) }


      h_old = {}
      title_second.each do |company, titles|
        titles.map do |title|
          h_old[title.user_id] = {
            company: company,
            rank: title.rank,
            level: title.level,
            title: title.title,
            role: title.role_name,
          }
        end
      end

      results = []
      user_ids = []
      title_first.each do |company, titles|
        titles.each do |title|
          next if h_old[title.user_id].nil? || h_old[title.user_id][:role] != title.role_name || h_old[title.user_id][:rank] <= title.rank || h_old[title.user_id][:company] != company
          results << {
            user_id: title.user_id,
            title_history_id: title.id,
            full_name: title.user.format_name_vietnamese,
            email: title.user.email,
            role: title.role_name,
            rank: title.rank,
            title: title.title,
            level: title.level,
            old_rank: h_old[title.user_id][:rank],
            old_title: h_old[title.user_id][:title],
            old_level: h_old[title.user_id][:level],
          }
          user_ids << title.user_id
        end
      end

      # 20.times do |i|
      #   results << {
      #     class: (i.even? ? "even" : "odd"),
      #     title_history_id: rand(i + 100),
      #     full_name: "#{rand(i + 100)} name name",
      #     email: "#{rand(i + 100)}aaa.@gmail.com",
      #     role: "#{rand(i + 100)} role role",
      #     rank: rand(i + 100),
      #     title: "#{rand(i + 100)} title tile",
      #     level: rand(i + 100),
      #     old_rank: rand(i + 100),
      #     old_title: "#{rand(i + 100)} title tile",
      #     old_level: rand(i + 100),
      #   }
      # end

      { data: results, user_ids: user_ids, period_id: first.values }
    end

    def data_users_keep_title
      number_keep = params[:number_period_keep].to_i
      
      if privilege_array.include? DASHBOARD_FULL_ACCESS
        user_ids = User.left_outer_joins(:project_members).where(filter_users).where.not(id: 1).pluck(:id).uniq
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_COMPANY
        user_ids = User.left_outer_joins(:project_members).where(filter_users).where(company_id: current_user.company_id).where.not(id: 1).pluck(:id).uniq
      elsif privilege_array.include? DASHBOARD_FULL_ACCESS_MY_PROJECT
        user_ids = User.left_outer_joins(:project_members).left_outer_joins(:approvers).where(filter_users).where(company_id: current_user.company_id,"project_members.project_id": ProjectMember.where(user_id: current_user.id).pluck(:project_id), id: Approver.where(approver_id: current_user.id).pluck(:user_id)).where.not(id: 1).pluck(:id).uniq
      end
 
      titles = case number_keep
        when 0
          Form.includes(:user, :period_keep, :role).where(user_id: user_ids).where("number_keep >= 1")
        when 1
          Form.includes(:user, :period_keep, :role).where(user_id: user_ids, number_keep: number_keep)
        when 2
          Form.includes(:user, :period_keep, :role).where(user_id: user_ids, number_keep: number_keep)
        when 3
          Form.includes(:user, :period_keep, :role).where(user_id: user_ids).where("number_keep >= 2")
        end
      titles.map.with_index do |title, i|
        {
          user_id: title.user_id,
          title_history_id: title.id,
          full_name: title.user&.format_name_vietnamese,
          email: title.user&.email,
          role: title.role&.name || "N/A",
          rank: title.rank,
          title: title.title&.name || "N/A",
          level: title.level,
          period_keep: title.period_keep&.format_name,
        }
      end
    end

    private

    attr_reader :current_user, :params, :privilege_array

    def filter_users
      filter = {
        status: true,
        is_delete: false,
      }

      filter[:company_id] = params[:company_id].map(&:to_i) if params[:company_id].present? && params[:company_id].first != "All"
      filter[:role_id] = params[:role_id].map(&:to_i) if params[:role_id].present? && params[:role_id].first != "All"
      filter[:project_members] = { project_id: params[:project_id].map(&:to_i) } if params[:project_id].present? && params[:project_id].first != "All"

      filter
    end

    def user_params
      {
        first_name: params[:first_name],
        last_name: params[:last_name],
        phone: params[:phone_number],
        skype: params[:skype],
        date_of_birth: params[:date_of_birth],
        nationality: params[:nationality],
        permanent_address: params[:permanent_address],
        current_address: params[:current_address],
        gender: params[:gender],
      }
    end
  end
end
