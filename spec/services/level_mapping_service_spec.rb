require "rails_helper"
RSpec.describe Api::LevelMappingService, type: :request do
  ADMIN_ID = 1
  before(:all) do
    config = Rails.application.config.database_configuration["test"]
    ActiveRecord::Base.establish_connection(config)
    User.connection
    @level_mapping_service ||= Api::LevelMappingService.new(level_mapping_params, current_user)
  end

  def current_user
    User.find_by_id(ADMIN_ID)
  end

  def level_mapping_params
    {
      id: "1",
      role_id: "1",
      id_level: "1",
      title_id: "1",
      level: "1",
      quantity: "1",
      type: "1",
      rank: "1",
      list_del: "1",
      list_new: "1",
      list_edit: "1",
      level_mapping_id: "1",
      records: {},
    }
  end

  it "get_role_without_level_mapping" do
    @level_mapping_service.get_role_without_level_mapping.should_not be_blank
  end

  it "get_title_mapping_for_new_level_mapping" do
    @level_mapping_service.get_title_mapping_for_new_level_mapping(1).should_not be_blank
  end

  it "get_title_mapping_for_edit_level_mapping" do
    @level_mapping_service.get_title_mapping_for_edit_level_mapping(1).should_not be_blank
  end

  it "get_data_level_mapping_list" do
    @level_mapping_service.get_data_level_mapping_list.should_not be_blank
  end
end
