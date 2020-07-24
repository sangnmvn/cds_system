module Api
  class UserManagementService < BaseService
    FULL_ACCESS = 1
    VIEW_USER_MANAGEMENT = 2
    ADD_APPROVER = 3
    ADD_REVIEWER = 4
    FULL_ACCESS_MY_COMPANY = 5

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
            <a class='action_icon edit_icon' data-toggle='tooltip' title='Edit user information' data-user_id='#{user.id}' href='javascript:;'>
              <i class='fa fa-pencil icon' style='color: #{full_access ? "#fc9803" : "rgb(77, 79, 78)"}'></i>
            </a>
              <a class='action_icon delete_icon' title='Delete the user' data-toggle='modal' data-target='#deleteModal' data-user_id='#{user.id}' data-user_account='#{user.account}' data-user_firstname='#{user.first_name}' data-user_lastname='#{user.last_name}' href='javascript:;'>
                <i class='fa fa-trash icon' style='color: #{full_access ? "red" : "rgb(77, 79, 78)"}'></i>
              </a>
              <a class='action_icon add-reviewer-icon'  title='Add Reviewer For User' #{(full_access || is_reviewer) ? "data-toggle='modal' data-target='#addReviewerModal' data-user_id='#{user.id}' data-user_account='#{user.format_name_vietnamese}'" : "style='filter: grayscale(100%)'"}  href='javascript:;'>
                <img border='0' src='/assets/add_reviewer.png' class='add-reviewer-icon'>
              </a>
              <a class='action_icon add-approver-icon' title='Add Approver For User' #{(full_access || is_approver) ? "data-toggle='modal'  data-target='#addApproverModal' data-user_id='#{user.id}' data-user_account='#{user.format_name_vietnamese}'" : "style='filter: grayscale(100%)'"} href='javascript:;'>
                <img border='0' src='/assets/add_approver.png' class='add-approver-icon'>
              </a>
              <a #{"class='action_icon status_icon'" if full_access} title='Disable/Enable User' data-user_id='#{user.id}' data-user_account='#{user.account}' href='javascript:;'>
                <i class='fa fa-toggle-#{user.status ? "on" : "off"}' style='margin-bottom: 0px; #{"color:rgb(77, 79, 78)" unless full_access}'></i>
              </a></div>")

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
      users = User.left_outer_joins(:project_members).where(filter_users).group(:gender).count

      h_users = {}
      h_users[:Male] = users[true] if users[true]
      h_users[:Female] = users[false] if users[false]

      { data: h_users, total: users.values.sum }
    end

    def data_users_by_role
      h_users = User.left_outer_joins(:project_members, :role).where(filter_users).where.not(role_id: nil).group("roles.name").count

      { data: h_users, total: h_users.values.sum }
    end

    def edit_user_profile
      user = User.find_by(id: params[:id])
      return false if user.blank?
      return false unless user.update(user_params)
      true
    end

    def data_users_by_seniority
      users = User.joins(:project_members).where(filter_users).group("TIMESTAMPDIFF(YEAR, users.joined_date, NOW())").count
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
      h_males = data_users_by_seniority
      list = ["<3", "3-5", "5-7", "7-10", ">10"]
      data = list.map do |i|
        next if h_males[i].nil?
        value = h_males[i] / 2.0
        { group: i, left: value, right: value }
      end.compact
      total = h_males.values.sum
      { data: data, total: total }
    end

    def data_users_by_title
      if params[:role_id] && params[:role_id].length == 1
        users = User.left_outer_joins(:project_members, :title).where(filter_users).where.not(role_id: 6).group("titles.name").count
        h_users = {}
        users.each do |key, value|
          h_users[key] = value
        end
        return h_users
      end
      users = User.left_outer_joins(:project_members, :title).where(filter_users).where.not(role_id: 6).group("titles.rank").count
      h_users = { "Associate" => 0, "Middle" => 0, "Senior" => 0, "> Senior" => 0 }
      users.each do |key, value|
        case key
        when 1
          h_users["Associate"] = value
        when 2
          h_users["Middle"] = value
        when 3
          h_users["Senior"] = value
        when 4..20
          h_users["> Senior"] = value
        end
      end
      h_users.select { |key, value| value > 0 }
    end

    def data_career_chart(user_id = nil)
      has_cdp = false
      user_id ||= current_user.id
      title_histories = TitleHistory.joins(:period).where(user_id: user_id).order("periods.to_date")
      h_rank_empty = {
        period: "",
        current_user.role.name => nil,
      }
      role_names = title_histories.pluck(:role_name).uniq
      role_names.each do |role_name|
        h_rank_empty[role_name] = nil
      end

      arr_result = []
      title_histories.each do |title_history|
        # new hash empty
        h_rank = h_rank_empty.clone
        h_rank[:period] = title_history.period&.format_period_career
        h_rank[title_history.role_name] = title_history.rank
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
          h_rank[form.role.name.to_sym] = data_result[:expected_title][:rank] || 0
          arr_result << h_rank
        end

        if data_result[:cdp].present? && data_result[:cdp][:title_id].present?
          has_cdp = true
          h_rank = h_rank_empty.clone
          h_rank[:period] = "Next Period"
          h_rank[form.role.name.to_sym] = data_result[:cdp][:rank] || 0
          arr_result << h_rank
        end
      end

      # arr_result = []
      # 20.times do |i|
      #   date = "#{2000 + rand(10)}/0#{rand(1..9)}/0#{rand(1..9)}"
      #   if i == 19
      #     arr_result << {
      #       period: date,
      #       "Quality Control": [1, 2, 3, 4, 5, 6, 7][rand(7)],
      #       "Business Analyst": nil,
      #     }
      #   else
      #     arr_result << {
      #       period: date,
      #       "Quality Control": [nil, 1, 2, 3, 4, 5, 6, 7][rand(7)],
      #       "Business Analyst": [nil, nil, nil, 4, 5, 6, 7][rand(7)],
      #     }
      #   end
      # end
      { data: arr_result, has_cdp: has_cdp }
    end

    def calulate_data_user_by_title
      h_males = data_users_by_title
      data = h_males.keys.map do |i|
        value = h_males[i] / 2.0
        { group: i, left: value, right: value }
      end
      total = h_males.values.sum
      { data: data, total: total }
    end

    def data_users_up_title
      user_ids = User.joins(:project_members).where(filter_users).pluck(:id)
      schedules = Schedule.where(status: "Done").order(end_date_hr: :desc)
      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end

      title_first = TitleHistory.includes(:user).where(user_id: user_ids, period_id: first.values)
      title_second = TitleHistory.where(user_id: user_ids, period_id: second.values)

      h_old = {}
      title_second.map do |title|
        h_old[title.user_id] = {
          rank: title.rank,
          level: title.level,
          title: title.title,
        }
      end
      results = []
      user_ids = []

      title_first.each_with_index do |title, i|
        next if h_old[title.user_id].present? && h_old[title.user_id][:role] != title.role_name && h_old[title.user_id][:rank] >= title.rank
        data = {
          class: (i.even? ? "even" : "odd"),
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

    def data_users_down_title
      user_ids = User.left_outer_joins(:project_members).where(filter_users).pluck(:id)
      schedules = Schedule.includes(:period).where(status: "Done").order("periods.to_date desc")

      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end

      title_first = TitleHistory.includes(:user).where(user_id: user_ids, period_id: first.values)
      title_second = TitleHistory.where(user_id: user_ids, period_id: second.values)

      h_old = {}
      title_second.map do |title|
        h_old[title.user_id] = {
          rank: title.rank,
          level: title.level,
          title: title.title,
          role: title.role_name,
        }
      end
      results = []
      user_ids = []
      title_first.each_with_index do |title, i|
        next if h_old[title.user_id].nil? || h_old[title.user_id][:role] != title.role_name || h_old[title.user_id][:rank] <= title.rank
        results << {
          class: (i.even? ? "even" : "odd"),
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
      user_ids = User.left_outer_joins(:project_members).where(filter_users).pluck(:id)

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
          class: (i.even? ? "even" : "odd"),
          title_history_id: title.id,
          full_name: title.user.format_name_vietnamese,
          email: title.user.email,
          role: title.role&.name || "N/A",
          rank: title.rank,
          title: title.title&.name || "N/A",
          level: title.level,
          period_keep: title.period_keep.format_name,
        }
      end

      # results = []
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
      #     period_keep: "#{rand(i + 100)} period period",
      #   }
      # end
      # results
    end

    private

    attr_reader :current_user, :params, :privilege_array

    def filter_users
      filter = {
        status: true,
        is_delete: false,
      }

      filter[:company_id] = params[:company_id].split(",").map(&:to_i) if params[:company_id].present? && params[:company_id] != "All"
      filter[:role_id] = params[:role_id].split(",").map(&:to_i) if params[:role_id].present? && params[:role_id] != "All"
      filter[:project_members] = { project_id: params[:project_id].split(",").map(&:to_i) } if params[:project_id].present? && params[:project_id] != "All"

      filter
    end

    private

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
