class AdminUsersController < ApplicationController
  layout "system_layout"
  before_action :set_admin_user, only: [:update]

  def index
    @companies = Company.all.order(:name)
    @projects = Project.all.order(:desc)
    @roles = Role.all.order(:name)
    @admin_users = AdminUser.all
    @project_members = ProjectMember.all

    respond_to do |format|
      format.html
      format.json { render json: AdminUserDatatable.new(params) }
    end
  end

  def add_previewer
    user_id = params[:id]
    all_user_id_except_self = AdminUser.where.not(id: user_id)

    @existing_previewers = all_user_id_except_self.where(id: Approver.where(admin_user_id: user_id).pluck(:approver_id))
    @available_admin_users = all_user_id_except_self.where.not(id: @existing_previewers.pluck(:id))

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
      projects = Project.all
      roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
    else
      projects = Project.all.where("company_id = ?", params[:company])
      roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]]).where("projects.company_id = ?", params[:company])
      binding.pry
    end
    respond_to do |format|
      format.json { render :json => { :projects => projects.order(:desc), :roles => roles.order(:name) } }
    end
  end

  def get_filter_project
    @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
    if params[:company] != "all"
      @roles = @roles.where("projects.company_id = ?", params[:company])
    end
    if params[:project] != "all" && params[:project] != "none"
      @roles = @roles.where("projects.id = ?", params[:project])
    end
    if params[:project] == "none"
      @roles = @roles.where("projects.company_id = ?", params[:company])
    end
    respond_to do |format|
      format.json { render :json => { :roles => @roles.order(:name) } }
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
  def edit
    user = AdminUser.where(id: params[:id])
    companies = Company.all
    # project company user
    projects = Project.where(company_id: user[0]["company_id"])
    roles = Role.all
    # project user
    project_user = ProjectMember.joins(:admin_user, :project).select("projects.id").where(admin_user_id: params[:id]).map(&:id)
    respond_to do |format|
      format.json { render :json => { companies: companies, projects: projects, roles: roles, user: user, project_user: project_user } }
    end
  end

  # modal company
  def get_modal_project
    @projects = Project.where(company_id: params[:company])
    respond_to do |format|
      format.json { render :json => { :projects => @projects } }
    end
  end

  # submit
  def submit_filter
    @roles = Role.all
    @projects = Project.all
    @companies = Company.all
    if params[:project] == "all"
      @project_members = ProjectMember.all
    else
      @project_members = ProjectMember.all.where("project_id = ?", params[:project])
    end
    @admin_users = AdminUser.all
    if params[:company] != "all"
      @admin_users = @admin_users.where("company_id = ?", params[:company])
    end
    if params[:project] != "all" && params[:project] != "none"
      valid_user_ids = @admin_users.joins(:project_members).distinct.where("project_id = ?", params[:project]).pluck("admin_users.id")
      @admin_users = @admin_users.where("id in (?)", valid_user_ids)
    elsif params[:project] == "none"
      # binding.pry
      valid_user_ids = ProjectMember.left_outer_joins(:admin_user).pluck("admin_users.id")
      @admin_users = @admin_users.where("id not in (?)", valid_user_ids) unless valid_user_ids.empty?
    end
    if params[:role] != "all" && params[:role] != "" && params[:role] != "none"
      @admin_users = @admin_users.where("role_id = ?", params[:role])
    end

    respond_to do |format|
      format.js
      # format.json { render :json => { projects: @projects, roles: @roles, companies: @companies, project_members: @project_members, admin_users: @admin_users } }
    end
  end

  def check_emai_account
    email = AdminUser.where(email: params[:email]).present?
    account = AdminUser.where(account: params[:account]).present?
    render :json => { email: email, account: account }
  end

  def update
    email_exist = AdminUser.where.not(id: params[:id]).where(email: params[:email]).present? ? true : false
    account_exist = AdminUser.where.not(id: params[:id]).where(account: params[:account]).present? ? true : false
    respond_to do |format|
      if email_exist || account_exist
        format.json { render :json => { :status => "exist", :email_exist => email_exist, :account_exist => account_exist } }
      else
        if @admin_user.update(admin_user_params)
          project_user = ProjectMember.joins(:admin_user, :project).select("project_members.id,projects.id")
            .where(admin_user_id: params[:id]).map(&:id)
          password_default = "password"
          management_default = 0
          if params[:project].nil?
            ProjectMember.find_by(admin_user_id: params[:id]).destroy
            # delete all
          elsif project_user.empty? && !params[:project].nil?
            # insert all params[:project]
            params[:project].each do |pro|
              ProjectMember.create!(admin_user_id: params[:id], project_id: pro.to_i, is_managent: management_default)
            end
          elsif !project_user.empty? && !params[:project].nil?
            params[:project].each do |pro|
              if pro.to_i.in?(project_user)
                project_user.delete(pro.to_i)
              else
                # insert
                ProjectMember.create!(admin_user_id: params[:id], project_id: pro.to_i, is_managent: management_default)
              end
            end
            unless project_user.empty?
              # del
              project_user.each do |old|
                ProjectMember.find_by(admin_user_id: params[:id], project_id: old).delete
              end
            end
          end

          format.json { render :json => { :status => "success" } }
        else
          format.json { render :json => { :status => "fail" } }
        end
      end
    end
  end

  private

  def set_admin_user
    @admin_user = AdminUser.find(params[:id])
  end

  def admin_user_params
    params.permit(:first_name, :last_name, :email, :account, :company_id, :role_id)
  end
end
