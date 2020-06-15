class UsersController < ApplicationController
  layout "system_layout"
  before_action :set_user, only: [:edit, :update, :status, :destroy]
  before_action :get_privilege_id, :user_management_serviece
  before_action :redirect_to_index, except: [:index2]

  def get_user_data
    filter = {
      is_delete: false,
    }
    unless @privilege_array.include?(1)
      project_ids = ProjectMember.where(user_id: current_user.id).pluck(:project_id)
      user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
      filter[:id] = user_ids
    end

    filter[:company_id] = user_params[:filter_company] if user_params[:filter_company] != "all"
    filter[:role_id] = user_params[:filter_role] if user_params[:filter_role] != "all"

    if user_params[:filter_project] != "all" && user_params[:filter_project] != "none"
      user_ids = ProjectMember.where(project_id: user_params[:filter_project]).pluck(:user_id).uniq
      filter[:id] = user_ids
    end

    users = User.includes(:role, :company).search_user(user_params[:search]).where(filter).offset(user_params[:offset]).limit(LIMIT).order(get_sort_params)

    if user_params[:filter_project] == "none"
      user_project_ids = ProjectMember.pluck(:user_id).uniq # user have project
      users = users.where.not(id: user_project_ids)
    end

    render json: { iTotalRecords: users.count, iTotalDisplayRecords: users.unscope([:limit, :offset]).count, aaData: @user_management_serviece.format_user_data(users) }
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
    user = User.find_by_id(user_id)
    @reviewers = Approver.includes(:approver).where(user_id: user_id)
    @available_users = User.where.not(id: @reviewers.pluck(:approver_id)).where(company_id: user.company_id)

    respond_to :js
  end

  def add_reviewer_to_database
    if params[:approver_ids] == "none"
      approver_ids = []
    else
      approver_ids = params[:approver_ids].split(",").map(&:to_i)
    end

    # delete all approvers
    Approver.where(user_id: params[:id]).destroy_all

    # add approver in list
    approver_ids.each do |approver_id|
      Approver.create!(user_id: user_id, approver_id: approver_id)
    end
  end

  def destroys
    return render json: { status: "success", deleted_id: params[:id] } if @user.update(is_delete: true)

    render json: { status: "fail" }
  end

  def get_filter_company
    render json: @user_management_serviece.get_filter_company
  end

  def get_filter_project
    render json: { roles: @user_management_serviece.get_filter_project }
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

    binding.pry

    user_param = {
      id: user_params[:id],
      first_name: user_params[:first_name],
      last_name: user_params[:last_name],
      email: user_params[:email],
      account: user_params[:account],
      company_id: user_params[:company_id],
      role_id: user_params[:role_id],
    }
    if @user.update(user_param)
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
    if users.empty?
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

  def user_management_serviece
    @user_management_serviece = Api::UserManagementService.new(user_params, current_user, @privilege_array)
  end

  def user_params
    params[:offset] = params[:iDisplayStart].to_i
    params[:search] = params[:sSearch]
    params[:filter_company] = params["filter-company"]
    params[:filter_role] = params["filter-role"]
    params[:filter_project] = params["filter-project"]
    params.permit(:id, :first_name, :last_name, :email, :account,
                  :company_id, :role_id, :status, :is_delete, :offset,
                  :search, :filter_company, :filter_role, :filter_project, :project_id)
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
