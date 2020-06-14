module Api
  class UserManagementService < BaseService
    def initialize(params, current_user, privilege_array)
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
        current_user_data.push(user.title)
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

    private

    attr_reader :current_user, :params, :privilege_array
  end
end
