class AdminUserController < ApplicationController
  layout "system_layout"

  def index
    @companies = Company.all
    @projects = Project.all
    @roles = Role.all
    # params[:user] = "103"
    # @user = AdminUser.where(id: params[:user])
    # @project_user = ProjectMember.joins(:admin_user, :project).select("projects.id,projects.desc").where(admin_user_id: params[:user])
    @admin_users = AdminUser.all
    @project_members = ProjectMember.all

    respond_to do |format|
      format.html
      format.json { render json: AdminUserDatatable.new(params) }
    end
  end

  def destroy
    binding.pry
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

  def filter_users_management
    @company = params[:company]
    @project = params[:project]
    @projects = Project.all
    @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])

    if params[:company] != "all"
      @projects = @projects.where("company_id = ?", params[:company])
      @roles = @roles.where("projects.company_id = ?", params[:company])
    end
    if params[:project] != "all"
      @projects = @projects.where("id = ?", params[:project])
      @roles = @roles.where("projects.id = ?", params[:project])
    end

    # binding.pry
    respond_to do |format|
      format.js { }
    end
  end

  # add
  def add_users_management
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
        @status = true
        format.js { }
      else
        format.js { }
      end
    end
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
    binding.pry
    @current_page = params[:page] || "1"
    @current_page = @current_page.to_i
    @total_page = (AdminUser.count / 20.to_f).ceil
    @roles = Role.all
    @projects = Project.all
    @project_members = params[:project] == "all" ? ProjectMember.all : ProjectMember.all.where("project_id = ?", params[:project])
    @companies = Company.all
    @admin_users = AdminUser.offset((@current_page - 1) * 20).limit(20)
    if params[:company] != "all"
      @admin_users = @admin_users.where("company_id = ?", params[:company])
    end
    if params[:role] != "all"
      @admin_users = @admin_users.where("role_id = ?", params[:role])
    end
    if params[:project] != "all"
      valid_user_ids = @admin_users.joins(:project_members).distinct.where("project_id=?", params[:project]).pluck("admin_users.id")
      @admin_users = @admin_users.where("id in (?)", valid_user_ids)
    end
    # binding.pry

    respond_to do |format|
      # format.js
    end
  end

  # modal edit
  def get_modal_edit_users_management
    binding.pry
  end

  private

  def admin_user_params
    params.require(:admin_user).permit(:id)
  end
end
