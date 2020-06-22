module Api
  class UserManagementService < BaseService
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
      projects = Project.distinct.select("project_members.user_id as user_id", :desc).joins(:project_members).where(project_members: { user_id: users.pluck(:id) }).order(:desc)
      h_projects = {}
      projects.map do |project|
        h_projects[project.user_id] = [] if h_projects[project.user_id].nil?
        h_projects[project.user_id] << project.desc
      end

      users.map.with_index do |user, index|
        current_user_data = []
        current_user_data.push("<td class='selectable'><div class='resource_selection_cell'><input type='checkbox' id='batch_action_item_#{user.id}' value='0' class='collection_selection' name='collection_selection[]'></div></td>")

        number = params[:offset] + index + 1
        current_user_data.push("<p class='number'>#{number}</p>")
        current_user_data.push(user.first_name)
        current_user_data.push(user.last_name)
        current_user_data.push(user.email)
        current_user_data.push(user.account)

        current_user_data.push(user.role.name)
        current_user_data.push(user.title&.name)
        project_name = h_projects[user.id].present? ? h_projects[user.id].join(", ") : ""
        current_user_data.push(project_name)
        current_user_data.push(user.company.name)
        # column action
        pri = privilege_array.include?(1)
        current_user_data.push("<div style='text-align: center'>
            <a class='action_icon edit_icon' data-toggle='tooltip' title='Edit user information' data-user_id='#{user.id}' href='javascript:;'>
              <i class='fa fa-pencil icon' style='color: #{pri ? "#fc9803" : "rgb(77, 79, 78)"}'></i>
            </a>
              <a class='action_icon delete_icon' title='Delete the user' data-toggle='modal' data-target='#deleteModal' data-user_id='#{user.id}' data-user_account='#{user.account}' data-user_firstname='#{user.first_name}' data-user_lastname='#{user.last_name}' href='javascript:;'>
                <i class='fa fa-trash icon' style='color: #{pri ? "red" : "rgb(77, 79, 78)"}'></i>
              </a>
              <a class='action_icon add_reviewer_icon' data-toggle='modal' title='Add Reviewer For User' data-target='#addReviewerModal' data-user_id='#{user.id}' data-user_account='#{user.first_name} #{user.last_name}'  href='javascript:;'>
                <img border='0' src='/assets/Assign_User.png' class='assign_user_img'>
              </a>
              <a #{"class='action_icon status_icon'" if pri} title='Disable/Enable User' data-user_id='#{user.id}' data-user_account='#{user.account}' href='javascript:;'>
                <i class='fa fa-toggle-#{user.status ? "on" : "off"}' style='margin-bottom: 0px; #{"color:rgb(77, 79, 78)" unless pri}'></i>
              </a></div>")

        datas << current_user_data
      end
      datas
    end

    def get_filter_company
      if params[:company_id] == "all"
        projects = Project.select(:id, :desc).order(:desc)
        roles = Role.select(:id, :name).order(:name)
      else
        projects = Project.select(:id, :desc).where(company_id: params[:company_id]).order(:desc)
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
      h_users = User.left_outer_joins(:project_members, :role).where(filter_users).group("roles.desc").count

      { data: h_users, total: h_users.values.sum }
    end

    def data_users_by_seniority(gender = false)
      users = User.where(filter_users).where(gender: gender).group("TIMESTAMPDIFF(YEAR, users.joined_date, NOW())").count
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

      h_users
    end

    def calulate_data_user_by_seniority
      h_males = data_users_by_seniority(true)
      h_females = data_users_by_seniority
      list = ["<3", "3-5", "5-7", "7-10", ">10"]
      data = list.map do |i|
        { group: i, males: h_males[i], females: h_females[i] }
      end
      total = h_males.values.sum + h_females.values.sum
      { data: data, total: total }
    end

    def data_users_by_title(gender = false)
      users = User.left_outer_joins(:project_members, :title).where(filter_users).where(gender: gender).where.not(role_id: 6).group("titles.rank").count

      if params[:role_id] && params[:role_id].length == 1
        h_users = {}
        count_title = Title.where(role_id: params[:role_id]).count
        count_title.times do |i|
          h_users[i + 1] = 0
        end

        users.each do |key, value|
          h_users[key] = value
        end
        return h_users
      end
      h_users = { "1" => 0, "2" => 0, "3" => 0, ">3" => 0 }
      users.each do |key, value|
        case key
        when 1
          h_users["1"] = value
        when 2
          h_users["2"] = value
        when 3
          h_users["3"] = value
        when 4..20
          h_users[">3"] = value
        end
      end
      h_users
    end

    def calulate_data_user_by_title
      h_males = data_users_by_title(true)
      h_females = data_users_by_title
      list = (h_males.keys + h_females.keys).uniq
      data = list.map do |i|
        { group: i, males: h_males[i], females: h_females[i] }
      end
      total = h_males.values.sum + h_females.values.sum
      { data: data, total: total }
    end

    def data_user_up_title
      user_ids = User.where(filter_users).pluck(:id)
      forms = Form.where(user_id: user_ids, is_delete: false)
    end

    private

    attr_reader :current_user, :params, :privilege_array

    def filter_users
      filter = {
        status: true,
        is_delete: false,
      }
      filter[:company_id] = params[:company_id].split(",") if params[:company_id].present? && params[:company_id] != "All"
      filter[:role_id] = params[:role_id].split(",") if params[:role_id].present? && params[:role_id] != "All"
      filter[:project_members] = { project_id: params[:project_id].split(",") } if params[:project_id].present? && params[:project_id] != "All"

      filter
    end
  end
end
