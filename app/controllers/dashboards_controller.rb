class DashboardsController < ApplicationController
  layout "root_layout"
  before_action :user_management_serviece

  def index
  end

  def data_filter
    render json: {
      companies: Company.select(:name, :id),
      projects: Project.select("projects.desc as name", :id),
      roles: Role.select("roles.desc as name", :id),
    }
  end

  def data_users_by_gender
    data = @user_management_serviece.data_users_by_gender
    render json: data
  end

  def data_users_by_role
    data = @user_management_serviece.data_users_by_role
    render json: data
  end

  def calulate_data_user_by_seniority
    data = @user_management_serviece.calulate_data_user_by_seniority
    render json: data
  end

  def calulate_data_user_by_rank
    data = @user_management_serviece.calulate_data_user_by_rank
    render json: data
  end

  def data_user_up_title
  end

  def data_user_keep_all
  end

  private

  def user_management_serviece
    @user_management_serviece = Api::UserManagementService.new(params, current_user)
  end
end
