require "rails_helper"
RSpec.describe Api::UserManagementService, type: :request do
  ADMIN_ID = 1
  before(:all) do
    config = Rails.application.config.database_configuration["test"]
    ActiveRecord::Base.establish_connection(config)
    User.connection
    @user_mgmt_service ||= Api::UserManagementService.new(user_params, current_user)
  end

  def current_user
    User.find_by_id(ADMIN_ID)
  end

  def user_params
    {
      id: 1, first_name: "first_name",
      last_name: "last_name", email: "fake@bestarion.com",
      account: "test", company_id: [3],
      role_id: [2], status: 1,
      is_delete: 0, offset: 20,
      search: "", filter_company: 3,
      filter_role: 1, filter_project: 1,
      project_id: [1], joined_date: Date.new,
      phone_number: "0987654321", date_of_birth: 20.years.ago,
      gender: 1, skype: "skype",
      nationality: 1, permanent_address: 1,
      current_address: "1111", user_id: 2,
      add_approver_ids: 13, add_reviewer_ids: 6,
      remove_ids: 0, url: "111",
      is_submit_late: 0,
    }
  end

  it "format_user_data" do
    user = User.all
    @user_mgmt_service.format_user_data(user).should_not be_blank
  end

  it "get_filter_company company_id all" do
    params = user_params.clone
    params[:company_id] = ["All"]
    user_mgmt_service = Api::UserManagementService.new(params, current_user)
    user_mgmt_service.get_filter_company.should_not be_blank
  end

  it "get_filter_company" do
    @user_mgmt_service.get_filter_company.should_not be_blank
  end

  it "get_filter_project" do
    @user_mgmt_service.get_filter_project.should_not be_blank
  end

  it "data_users_by_role" do
    @user_mgmt_service.data_users_by_role.should_not be_blank
  end

  it "edit_user_profile" do
    @user_mgmt_service.edit_user_profile.should eql(true)
  end

  it "data_users_by_seniority" do
    params = {
      company_id: ["All"],
      project_id: ["All"],
      role_id: ["All"],
    }
    user_mgmt_service = Api::UserManagementService.new(params, current_user)
    user_mgmt_service.data_users_by_seniority.keys.count.should eql(5)
  end

  it "calulate_data_user_by_seniority" do
    params = {
      company_id: ["All"],
      project_id: ["All"],
      role_id: ["All"],
    }
    user_mgmt_service = Api::UserManagementService.new(params, current_user)
    user_mgmt_service.calulate_data_user_by_seniority.should_not be_blank
  end

  it "data_users_by_title all" do
    params = {
      company_id: ["All"],
      project_id: ["All"],
      role_id: ["All"],
    }
    user_mgmt_service = Api::UserManagementService.new(params, current_user)
    user_mgmt_service.data_users_by_title.should_not be_blank
  end

  it "data_users_by_title" do
    @user_mgmt_service.data_users_by_title.should be_blank
  end

  it "data_career_chart" do
    @user_mgmt_service.data_career_chart.should_not be_blank
  end

  it "calulate_data_user_by_title" do
    @user_mgmt_service.calulate_data_user_by_title.should_not be_blank
  end

  it "data_users_up_title" do
    @user_mgmt_service.data_users_up_title.should_not be_blank
  end

  it "data_users_down_title" do
    @user_mgmt_service.data_users_down_title.should_not be_blank
  end

  it "data_users_keep_title" do
    @user_mgmt_service.data_users_keep_title.should be_blank
  end
end
