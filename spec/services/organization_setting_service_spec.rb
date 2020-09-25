require "rails_helper"
RSpec.describe Api::OrganizationSettingsService, type: :request do
  ADMIN_ID = 1
  before(:all) do
    config = Rails.application.config.database_configuration["test"]
    ActiveRecord::Base.establish_connection(config)
    User.connection
    @org_setting_service ||= Api::OrganizationSettingsService.new(org_setting_params, current_user)
  end

  def current_user
    User.find_by_id(ADMIN_ID)
  end

  def org_setting_params
    {
      company_id: "2", company_name: "2",
      company_abbreviation: "2", company_establishment: "2",
      company_phone: "2", company_fax: "2",
      company_email: "2", company_website: "2",
      company_address: "2", company_desc: "2",
      company_ceo: "2", company_tax_code: "2",
      company_note: "2", company_quantity: "2",
      company_email_group_staff: "2", company_email_group_hr: "2",
      company_email_group_fa: "2", company_email_group_it: "2",
      company_email_group_admin: "2", parent_company_id: "2",
      project_id: "2", project_name: "2",
      project_company_name: "2", project_abbreviation: "2",
      project_establishment: "2", project_email: "2",
      project_address: "2", project_desc: "2",
      project_note: "2", project_quantity: "2",
      project_closed_date: "2", project_customer: "2",
      project_manager: "2", role_id: "2",
      role_name: "2", role_abbreviation: "2",
      role_desc: "2", role_note: "2",
      title_id: "2", project_sponsor: "2",
      title_name: "2", title_role_name: "2",
      title_abbreviation: "2", title_rank: "2",
      title_address: "2", title_desc: "2",
      title_note: "2",
    }
  end

  it "data_company" do
    @org_setting_service.data_company.should_not be_blank
  end

  it "data_role" do
    @org_setting_service.data_role.should_not be_blank
  end

  it "data_title" do
    @org_setting_service.data_title.should_not be_blank
  end

  it "save_company" do
    @org_setting_service.save_company.should_not be_blank
  end

  it "save_project" do
    @org_setting_service.save_project.should_not be_blank
  end

  it "save_role" do
    @org_setting_service.save_role.should_not be_blank
  end

  it "save_title" do
    @org_setting_service.save_title.should_not be_blank
  end
end
