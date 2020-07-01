class DashboardsController < ApplicationController
  layout "root_layout"
  before_action :get_privilege_id, :check_privilege
  before_action :user_management_services

  ALL_COMPANY = 20
  MY_COMPANY = 21
  MY_PROJECT = 22
  VIEW = 23

  def index
    redirect_to index2_users_path if !(@privilege_array & [ALL_COMPANY, MY_COMPANY, MY_PROJECT]).any?
  end

  def data_filter
    if @privilege_array.include?(ALL_COMPANY)
      companies = Company.select(:name, :id)
      projects = Project.select("projects.desc as name", :id)
    elsif @privilege_array.include?(MY_COMPANY)
      companies = Company.select(:name, :id).where(id: current_user.company_id)
      projects = Project.select("projects.desc as name", :id).where(company_id: current_user.company_id)
    elsif @privilege_array.include?(MY_PROJECT)
      companies = Company.select(:name, :id).where(id: current_user.company_id)
      projects = Project.select("projects.desc as name", :id).joins(:project_members).where(project_members: { user_id: current_user.id })
    end
    roles = User.distinct.select("roles.desc as name", "role_id as id").joins(:project_members, :role).where(company_id: companies.pluck(:id), project_members: { project_id: projects.pluck(:id) })

    render json: {
      companies: companies,
      projects: projects,
      roles: roles,
    }
  end

  def data_users_by_gender
    data = @user_management_services.data_users_by_gender
    render json: data
  end

  def data_users_by_role
    data = @user_management_services.data_users_by_role
    render json: data
  end

  def calulate_data_user_by_seniority
    data = @user_management_services.calulate_data_user_by_seniority
    render json: data
  end

  def calulate_data_user_by_title
    data = @user_management_services.calulate_data_user_by_title
    render json: data
  end

  def data_users_up_title
    render json: @user_management_services.data_users_up_title
  end

  def data_users_keep_title
    render json: { data: @user_management_services.data_users_keep_title }
  end

  private

  def user_management_services
    @user_management_services = Api::UserManagementService.new(params, current_user)
  end

  def check_privilege
    redirect_to index2_users_path if @privilege_array.include?(VIEW) && !(@privilege_array & [ALL_COMPANY, MY_COMPANY, MY_PROJECT]).any?
  end
end
