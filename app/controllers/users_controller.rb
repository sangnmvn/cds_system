class UsersController < ApplicationController
  layout "system_layout"
  before_action :set_user, only: [:edit, :update, :status, :destroy]
  before_action :get_privilege_id
  before_action :redirect_to_index, except: [:index2]

  def get_user_data
    binding.pry
    filter = {
      is_delete: false,
    }
    unless @privilege_array.include?(1)
      project_ids = ProjectMember.where(user_id: current_user.id).pluck(:project_id)
      user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
      filter[:id] = user_ids
    end

    filter[:company_id] = set_params[:filter_company] if set_params[:filter_company] != "all"

    filter[:role_id] = set_params[:filter_role] if set_params[:filter_role] != "all"

    if set_params[:filter_project] != "all" && set_params[:filter_project] != "none"
      user_ids = ProjectMember.where(project_id: set_params[:filter_project]).pluck(:user_id).uniq
      filter[:id] = user_ids
    end

    users = User.search_user(set_params[:search]).where(filter).offset(set_params[:offset]).limit(LIMIT).order(get_sort_params)

    if set_params[:filter_project] == "none"
      user_project_ids = ProjectMember.pluck(:user_id).uniq # user have project
      users = users.where.not(id: user_project_ids)
    end

    render json: { iTotalRecords: users.count, iTotalDisplayRecords: users.unscope([:limit, :offset]).count, aaData: format_data(users) }
  end

  def format_data(users)
    datas = []
    users.map.with_index do |user, index|
      current_user_data = []
      current_user_data.push("<td class='selectable'><div class='resource_selection_cell'><input type='checkbox' id='batch_action_item_#{user.id}' value='0' class='collection_selection' name='collection_selection[]'></div></td>")

      number = set_params[:offset] + index + 1
      current_user_data.push("<p class='number'>#{number}</p>")
      current_user_data.push(user.first_name)
      current_user_data.push(user.last_name)
      current_user_data.push(user.email)
      current_user_data.push(user.account)

      role = user.role_id.nil? ? "" : Role.select(:name).find(user.role_id).name
      current_user_data.push(role)
      current_user_data.push(user.title)

      project_ids = ProjectMember.where(user_id: user.id).pluck(:project_id)
      project_name = Project.find(project_ids).pluck(:desc).join(", ")
      current_user_data.push(project_name)
      company = user.company_id.nil? ? "" : Company.select(:name).find(user.company_id).name
      current_user_data.push(company)
      # column action
      pri = @privilege_array.include?(1)
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

  def index
    @companies = Company.order(:name).pluck(:name, :id)
    @projects = Project.order(:desc).pluck(:desc, :id)
    @roles = Role.order(:name).pluck(:name, :id)
  end

  def index2
  end

  def add_reviewer
    user_id = params[:id]
    all_user_id_except_self = User.where.not(id: user_id).where(is_delete: false)
    @existing_reviewers = all_user_id_except_self.where(id: Approver.where(user_id: user_id).distinct.pluck(:approver_id))
    @available_users = all_user_id_except_self.where.not(id: @existing_reviewers.pluck(:id))

    respond_to do |format|
      format.js
    end
  end

  def add_reviewer_to_database
    if params[:approver_ids] == "none"
      approver_ids = []
    else
      approver_ids = params[:approver_ids].split(",").map(&:to_i)
    end
    user_id = params[:id].to_i
    # delete approver not in list
    Approver.where(user_id: user_id).where.not(approver_id: approver_ids).destroy_all
    # add approver in list
    approver_ids.each { |approver_id|
      Approver.create!(user_id: user_id, approver_id: approver_id)
    }
  end

  def destroy
    params[:is_delete] = true
    return render json: { status: "success", deleted_id: params[:id] } if @user.update(user_params)

    render json: { status: "fail" }
  end

  def get_filter_company
    if params[:company] == "all"
      projects = Project.select(:id, :desc).order(:desc)
      roles = Role.select(:id, :name).order(:name)
    else
      projects = Project.select(:id, :desc).where(company_id: params[:company]).order(:desc)
      user_ids = User.where(company_id: params[:company], is_delete: false).pluck(:role_id).uniq
      roles = Role.select(:id, :name).where(id: user_ids).order(:name)
    end

    render json: { projects: projects, roles: roles }
  end

  def get_filter_project
    filter = {
      is_delete: false,
    }
    filter[:company_id] = params[:company] if params[:company] != "all"
    if params[:project] != "all" && params[:project] != "none"
      user_ids = ProjectMember.where(project_id: params[:project]).pluck(:user_id).uniq
      filter[:id] = user_ids
    end

    users = User.where(filter)

    if params[:project] == "none"
      user_ids = ProjectMember.pluck(:user_id).uniq
      users = users.where.not(id: user_ids).pluck(:role_id)
    end
    roles = Role.select(:id, :name).where(id: users.pluck(:role_id)).order(:name)

    render json: { roles: roles }
  end

  def create
    management_default = 0
    params[:email] = params[:email].strip
    params[:account] = params[:account].strip
    email_exist = User.find_by_email(params[:email]).present?
    account_exist = User.find_by_account(params[:account]).present?
    return render json: { status: "exist", email: email_exist, account: email_exist } if email_exist || account_exist

    use_new = User.new(email: params[:email], password: PASSWORD_DEFAULT, first_name: params[:first],
                       last_name: params[:last], account: params[:account],
                       company_id: params[:company], role_id: params[:role])

    if use_new.save
      if params[:project].present?
        params[:project].each do |id|
          ProjectMember.create!(user_id: use_new.id, project_id: id.to_i, is_managent: management_default)
        end
      end
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  # get data modal edit
  def edit
    companies = Company.select(:id, :name)
    projects = Project.select(:id, :desc).where(company_id: @user.company_id)
    roles = Role.select(:id, :name)
    project_ids = ProjectMember.where(user_id: params[:id]).pluck(:project_id)

    render json: { companies: companies, projects: projects, roles: roles, user: @user, project_ids: project_ids }
  end

  # modal company
  def get_modal_project
    projects = Project.select(:id, :desc).where(company_id: params[:company])

    render json: projects
  end

  def update
    params[:email] = params[:email].strip
    params[:account] = params[:account].strip
    email_exist = User.select(:id).where.not(id: params[:id]).where(email: params[:email]).present?
    account_exist = User.select(:id).where.not(id: params[:id]).where(account: params[:account]).present?
    return render json: { status: "exist", email_exist: email_exist, account_exist: account_exist } if email_exist || account_exist

    if @user.update(user_params)
      project_user = ProjectMember.joins(:user, :project).select("project_members.id,projects.id").where(user_id: params[:id]).map(&:id)
      management_default = 0

      ProjectMember.find_by(user_id: params[:id])&.destroy
      if params[:project].present?
        params[:project].each do |pro|
          ProjectMember.create!(user_id: params[:id], project_id: pro.to_i, is_managent: management_default)
        end
      end

      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def delete_multiple_users
    status = "success"
    status = "fail" if params[:list_users].nil?

    users = User.where(id: params[:list_users])
    if users.count.zero?
      status = "fail"
    else
      users.update(is_delete: true)
    end
    render json: { status: status }
  end

  def disable_multiple_users
    status = "success"
    status = "fail" if params[:list_users].nil?

    users = User.where(id: params[:list_users])
    if users.count.zero?
      status = "fail"
    else
      users.update(status: false)
    end
    render json: { status: status }
  end

  def enable_multiple_users
    status = "success"
    status = "fail" if params[:list_users].nil?

    users = User.where(id: params[:list_users])
    if users.count.zero?
      status = "fail"
    else
      users.update(status: true)
    end
    render json: { status: status }
  end

  # change status user (enable / disable)
  def status
    status = !@user.status
    return render json: { status: "success", change: status } if @user.update(status: status)
    render json: { status: "fail" }
  end

  private

  def redirect_to_index
    redirect_to index2_users_path unless (@privilege_array.include?(1) || @privilege_array.include?(2))
  end

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.permit(:id, :first_name, :last_name, :email, :account, :company_id, :role_id, :status, :is_delete)
  end

  def set_params
    {
      offset: params[:iDisplayStart].to_i,
      search: params[:sSearch],
      filter_company: params["filter-company"],
      filter_role: params["filter-role"],
      filter_project: params["filter-project"],
    }
  end

  def get_sort_params
    return { id: :desc } if params[:iSortCol_0] == "0"
    sort = case params[:iSortCol_0]
      when "1"
        :id
      when "2"
        :first_name
      when "3"
        :last_name
      when "4"
        :email
      when "5"
        :account
      when "6"
        :role_id
      when "9"
        :company_id
      else
        :id
      end

    { sort => params[:sSortDir_0] || :desc }
  end
end
