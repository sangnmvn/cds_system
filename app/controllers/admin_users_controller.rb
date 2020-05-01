class AdminUsersController < ApplicationController
  layout "system_layout"

  def index
    @companies = Company.all
    @projects = Project.all
    @roles = Role.all
    @admin_users = AdminUser.all
    @project_members = ProjectMember.all

    respond_to do |format|
      format.html
      format.json { render json: AdminUserDatatable.new(params) }
    end
  end

  def add_previewer
    user_id = params[:id]
    @existing_previewers = AdminUser.where(id: Approver.where(admin_user_id: user_id).pluck(:approver_id))
    @available_admin_users = AdminUser.where.not(id: @existing_previewers.pluck(:id))

    respond_to do |format|
      format.js
    end
  end

  def add_previewer_to_database
    approver_ids = params["approver_ids"].split(",").map(&:to_i)
    user_id = params["id"].to_i

    # delete approver not in list
    (Approver.where(admin_user_id: user_id)).where.not(approver_id: approver_ids).destroy_all
    # add approver in list
    approver_ids.each { |approver_id|
      Approver.create!(admin_user_id: user_id, approver_id: approver_id)
    }
  end

  def destroy
    user_id = params[:id]
    AdminUser.destroy(user_id)
    @companies = Company.all
    @projects = Project.all
    @roles = Role.all
    @admin_users = AdminUser.all
    @admin_users.reload
    @project_members = ProjectMember.all

    respond_to do |format|
      format.js
    end
  end

  def get_filter_company
    if params[:company] == "all"
      @projects = Project.all
      @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
    else
      @projects = Project.all.where("company_id = ?", params[:company])
      @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]]).where("projects.company_id = ?", params[:company])
    end
    respond_to do |format|
      format.json { render :json => { :projects => @projects, :roles => @roles, :project_current => params[:project] } }
    end
  end

  def get_filter_project
    if params[:company] == "all" && params[:project] == "all"
      @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
    elsif params[:company] == "all" && params[:project] != "all"
      @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
        .where("projects.id = ?", params[:project])
    elsif params[:company] != "all" && params[:project] == "all"
      @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
        .where("projects.company_id = ?", params[:company])
    elsif params[:company] != "all" && params[:project] != "all"
      @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
        .where("projects.company_id = ? and projects.id = ?", params[:company], params[:project])
    end
    respond_to do |format|
      format.json { render :json => { :roles => @roles } }
    end
  end

  # add
  def add
    password_default = "password"
    management_default = 0
    @use_new = AdminUser.new(email: params[:email], password: password_default, first_name: params[:first],
                             last_name: params[:last], account: params[:account],
                             company_id: params[:company], role_id: params[:role])
    respond_to do |format|
      if @use_new.save
        unless params[:project].nil?
          id_user_new = AdminUser.select("id").where("email = ?", params[:email])
          params[:project].each do |id|
            ProjectMember.create!(admin_user_id: id_user_new[0].id, project_id: id.to_i, is_managent: management_default)
          end
        end
        @companies = Company.all
        @projects = Project.all
        @roles = Role.all
        @admin_users = AdminUser.all
        @admin_users.reload
        @project_members = ProjectMember.all
        @status = true
        format.js { }
      else
        format.js { }
      end
    end
  end

  # get data modal edit
  def get_data_edit
    @companies = Company.all
    @projects = Project.all
    @roles = Role.all
    @user = AdminUser.where(id: params[:user_id])
    @project_user = ProjectMember.joins(:admin_user, :project).select("projects.id,projects.desc").where(admin_user_id: params[:user_id])
    respond_to do |format|
      format.js
    end
    # respond_to do |format|
    #   format.json { render :json => @user }
    # end
  end

  # modal company
  def get_project_modal_users_management
    @projects = Project.where(company_id: params[:company])
    respond_to do |format|
      format.js
    end
  end

  # submit
  def submit_filter_users_management
    @roles = Role.all
    @projects = Project.all
    @companies = Company.all
    @project_members = params[:project] == "all" ? ProjectMember.all : ProjectMember.all.where("project_id = ?", params[:project])
    @admin_users = AdminUser.all
    if params[:company] != "all"
      @admin_users = @admin_users.where("company_id = ?", params[:company])
    end
    if params[:project] != "all"
      valid_user_ids = @admin_users.joins(:project_members).distinct.where("project_id = ?", params[:project]).pluck("admin_users.id")
      @admin_users = @admin_users.where("id in (?)", valid_user_ids)
    end
    if params[:role] != "all"
      @admin_users = @admin_users.where("role_id = ?", params[:role])
    end

    respond_to do |format|
      format.js
    end
  end

  def check_emai_account
    email = AdminUser.where(email: params[:email]).present?
    account = AdminUser.where(account: params[:account]).present?
    render :json => { email: email, account: account }
  end

  private

  def admin_user_params
    params.require(:admin_user).permit(:id)
  end
end
