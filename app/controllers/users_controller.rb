class UsersController < ApplicationController
  layout "system_layout"
  before_action :set_user, only: [:edit, :update, :status, :destroy]
  before_action :get_privilege_id, :user_management_services
  before_action :redirect_to_index, except: [:index2, :user_profile, :edit_user_profile, :change_password]
  REVIEW_CDS = 16
  APPROVE_CDS = 17
  FULL_ACCESS = 1
  VIEW_ACCESS = 2
  ADD_APPROVER = 3
  ADD_REVIEWER = 4
  FULL_ACCESS_MY_COMPANY = 5

  def get_user_data
    filter = {
      is_delete: false,
    }
    filter[:company_id] = user_params[:filter_company] if user_params[:filter_company] != "all"
    filter[:role_id] = user_params[:filter_role] if user_params[:filter_role] != "all"

    if user_params[:filter_project] != "all" && user_params[:filter_project] != "none"
      user_ids = ProjectMember.where(project_id: user_params[:filter_project]).pluck(:user_id).uniq
      filter[:id] = user_ids
    end
    users = User.includes(:role, :company, :title, project_members: :project).search_user(user_params[:search]).where(filter).offset(user_params[:offset]).limit(LIMIT).order(get_sort_params).order(:email)

    if user_params[:filter_project] == "none"
      user_project_ids = ProjectMember.pluck(:user_id).uniq # user have project
      users = users.where.not(id: user_project_ids)
    end
    render json: { iTotalRecords: users.count, iTotalDisplayRecords: users.unscope([:limit, :offset]).count, aaData: @user_management_services.format_user_data(users) }
  end

  def index
    @crud_user = (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any?
    company_id = current_user.company_id if @privilege_array.include?(VIEW_ACCESS) && !@privilege_array.include?(FULL_ACCESS)
    if company_id
      @companies = Company.where(id: company_id, is_enabled: true).order(:name).pluck(:name, :id)
    else
      @companies = Company.where(is_enabled: true).order(:name).pluck(:name, :id)
    end
    @projects = Project.where(is_enabled: true).order(:name).pluck(:name, :id)
    @roles = Role.where(is_enabled: true).order(:name).pluck(:name, :id)
  end

  def get_filter
    h_filter = {}
    h_filter[:companies] = if @privilege_array.include?(VIEW_ACCESS) && !@privilege_array.include?(FULL_ACCESS)
        Company.where(id: current_user.company_id, is_enabled: true).order(:name).pluck(:name, :id)
      else
        Company.where(is_enabled: true).order(:name).pluck(:name, :id)
      end
    h_filter[:projects] = Project.where(company_id: h_filter[:companies].map(&:last), is_enabled: true).order(:name).pluck(:name, :id)
    h_filter[:roles] = Project.where(is_enabled: true).order(:name).pluck(:name, :id)

    render json: h_filter
  end

  def index2
  end

  def user_profile
    id = params[:id] || current_user.id
    id = id.to_i
    @user = User.find_by(id: id)
    @is_user = id == current_user.id
    @project = Project.includes(:project_members).where("project_members.user_id": id, is_enabled: true).pluck(:name).join(", ")
    form = Form.find_by(user_id: id, is_delete: false)
    @form = (form.blank? || form.title.blank?) ? "N/A" : "#{form.title.name} (Rank: #{form.rank}, Level: #{form.level})"
  end

  def edit_user_avatar
    FileUtils.cp(params[:url], "./images/user_avatar/#{current_user.account}")
    render json: true
  end

  def edit_user_profile
    render json: @user_management_services.edit_user_profile
  end

  def add_reviewer
    return render json: { reviewers: [], current_reviewers: [] } unless (@privilege_array & [ADD_REVIEWER, FULL_ACCESS]).any?
    user = User.left_outer_joins(:project_members).select(:company_id, "project_members.project_id").where(id: params[:user_id])
    company_id = user.first.company_id
    project_id = user.map(&:project_id)

    current_reviewers = Approver.where(user_id: params[:user_id], is_approver: false).pluck(:approver_id)
    reviewers = User.distinct.left_outer_joins(:project_members, user_group: :group).where("groups.privileges LIKE '%#{REVIEW_CDS}%'").where(project_members: { project_id: project_id }, company_id: company_id).where.not(id: params[:user_id])

    h_reviewers = []
    reviewers.each do |reviewer|
      h_reviewers << format_data_load_add_reviewer(reviewer, current_reviewers, false)
    end
    render json: { reviewers: h_reviewers, current_reviewers: current_reviewers }
  end

  def add_approver
    return render json: { approvers: [], current_approvers: 0 } unless (@privilege_array & [ADD_APPROVER, FULL_ACCESS]).any?
    user = User.left_outer_joins(:project_members).select(:company_id, "project_members.project_id").where(id: params[:user_id])
    company_id = user.first.company_id
    project_id = user.map(&:project_id)

    current_approvers = Approver.where(user_id: params[:user_id], is_approver: true).pluck(:approver_id)
    approvers = User.distinct.left_outer_joins(:project_members, user_group: :group).where("groups.privileges LIKE '%#{APPROVE_CDS}%'").where(project_members: { project_id: project_id }, company_id: company_id).where.not(id: params[:user_id])

    form = Form.find_by(user_id: params[:user_id])
    is_submit_late = form.present? ? form.is_submit_late : false

    h_approvers = []
    approvers.each do |approver|
      h_approvers << format_data_load_add_reviewer(approver, current_approvers)
    end

    render json: { approvers: h_approvers, current_approvers: current_approvers.first, is_submit_late: is_submit_late }
  end

  def add_reviewer_to_database
    begin
      form = Form.find_by(user_id: params[:user_id])
      form.update(is_submit_late: params[:is_submit_late]) if form.present?
      Approver.where(approver_id: params[:remove_ids], user_id: params[:user_id]).destroy_all
      if params[:add_approver_ids].present? && params[:add_approver_ids] != "0" && (@privilege_array & [ADD_APPROVER, FULL_ACCESS]).any?
        Approver.create(approver_id: params[:add_approver_ids].to_i, user_id: params[:user_id], is_approver: true)
      end

      if params[:add_reviewer_ids].present? && (@privilege_array & [ADD_REVIEWER, FULL_ACCESS]).any?
        params[:add_reviewer_ids].each do |approver_id|
          Approver.create(approver_id: approver_id.to_i, user_id: params[:user_id], is_approver: false)
        end
      end
      render json: { status: "success" }
    rescue
      render json: { status: "fails" }
    end
  end

  def destroy
    return render json: { status: "success", deleted_id: params[:id] } if @user.update(is_delete: true)

    render json: { status: "fail" }
  end

  def get_filter_company
    render json: @user_management_services.get_filter_company
  end

  def get_filter_project
    render json: { roles: @user_management_services.get_filter_project }
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
                       company_id: params[:company], role_id: params[:role], joined_date: params[:joined_date])

    if use_new.save
      if params[:project].present?
        params[:project].each do |id|
          ProjectMember.create!(user_id: use_new.id, project_id: id.to_i, is_managent: management_default)
        end
      end
      UserGroup.create(user_id: use_new.id, group_id: 6)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  # get data modal edit
  def edit
    companies = Company.select(:id, :name).where(is_enabled: true)
    projects = Project.select(:id, :name).where(company_id: @user.company_id, is_enabled: true)
    roles = Role.select(:id, :name).where(is_enabled: true)
    project_ids = ProjectMember.where(user_id: params[:id]).pluck(:project_id)

    render json: { companies: companies, projects: projects, roles: roles, user: @user, project_ids: project_ids, joined_date: @user.format_joined_date }
  end

  # modal company
  def get_modal_project
    projects = Project.select(:id, :name).where(company_id: params[:company], is_enabled: true)
    render json: projects
  end

  def update
    params[:email] = params[:email].strip
    params[:account] = params[:account].strip
    email_exist = User.select(:id).where.not(id: params[:id]).where(email: params[:email]).present?
    account_exist = User.select(:id).where.not(id: params[:id]).where(account: params[:account]).present?
    return render json: { status: "exist", email_exist: email_exist, account_exist: account_exist } if email_exist || account_exist

    user_param = {
      id: user_params[:id],
      first_name: user_params[:first_name],
      last_name: user_params[:last_name],
      email: user_params[:email],
      account: user_params[:account],
      company_id: user_params[:company_id],
      role_id: user_params[:role_id],
      joined_date: params[:joined_date],
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

  def change_password
    user = User.find_for_authentication(id: params[:id])
    if user.valid_password?(params[:old_password])
      if params[:new_password] != params[:confirm_password]
        return render json: { status: "Unequal" }
      else
        user.update(password: params[:new_password])
        return render json: { status: "success" }
      end
    else
      return render json: { status: "Uncorrect" }
    end
  end

  private

  def format_data_load_add_reviewer(approver, current_approver, approve = true)
    checked = current_approver.include?(approver.id)
    {
      id: approver.id,
      name: approver.format_name_vietnamese,
      email: approver.email,
      account: approver.account,
      checked: checked,
    }
  end

  def redirect_to_index
    redirect_to root_path unless (@privilege_array.include?(FULL_ACCESS) || @privilege_array.include?(VIEW_ACCESS))
  end

  def set_user
    @user = User.find(params[:id])
  end

  def user_management_services
    @user_management_services = Api::UserManagementService.new(user_params, current_user)
  end

  def user_params
    params[:offset] = params[:iDisplayStart].to_i
    params[:search] = params[:sSearch]
    params[:filter_company] = params["filter_company"]
    params[:filter_role] = params["filter_role"]
    params[:filter_project] = params["filter_project"]
    params.permit(:id, :first_name, :last_name, :email, :account, :company_id, :role_id, :status, :is_delete, :offset,
                  :search, :filter_company, :filter_role, :filter_project, :project_id, :joined_date, :phone_number,
                  :date_of_birth, :gender, :skype, :nationality, :permanent_address, :current_address,
                  :user_id, :add_approver_ids, :add_reviewer_ids, :remove_ids, :url, :is_submit_late)
  end

  def get_sort_params
    return { id: :desc } if params[:iSortCol_0] == "0"
    sort = case params[:iSortCol_0]
      when "1"
        { id: params[:sSortDir_0] || :desc }
      when "2"
        { first_name: params[:sSortDir_0] || :desc }
      when "3"
        { email: params[:sSortDir_0] || :desc }
      when "4"
        { account: params[:sSortDir_0] || :desc }
      when "5"
        "roles.name " + params[:sSortDir_0] || "desc"
      when "6"
        "titles.name " + params[:sSortDir_0] || "desc"
      when "7"
        "projects.name " + params[:sSortDir_0] || "desc"
      when "8"
        "companies.name " + params[:sSortDir_0] || "desc"
      else
        { id: params[:sSortDir_0] || :desc }
      end
  end
end
