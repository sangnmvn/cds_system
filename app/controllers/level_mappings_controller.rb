class LevelMappingsController < ApplicationController
  layout "system_layout"
  before_action :get_privilege_id
  before_action :level_mapping_service
  before_action :check_privilege
  FULL_ACCESS_ON_LEVEL_MAPPING = 18
  VIEW_LEVEL_MAPPING = 19

  def get_data_level_mapping
    render json: @level_mapping_service.get_data_level_mapping
  end

  def index
  end

  private

  def check_privilege
    redirect_to root_path unless (@privilege_array & [FULL_ACCESS_ON_LEVEL_MAPPING, VIEW_LEVEL_MAPPING]).any?
  end

  def level_mapping_service
    @level_mapping_service ||= Api::LevelMappingService.new(level_mapping_params, current_user)
  end

  def level_mapping_params
    params.permit([:id])
  end
end
