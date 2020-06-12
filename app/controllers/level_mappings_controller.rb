class LevelMappingsController < ApplicationController
  layout "system_layout"
  before_action :get_privilege_id
  before_action :level_mapping_service
  before_action :check_privilege
  FULL_ACCESS_ON_LEVEL_MAPPING = 18
  VIEW_LEVEL_MAPPING = 19

  def get_data_level_mapping_list
    render json: @level_mapping_service.get_data_level_mapping_list
  end

  def get_role_without_level_mapping
    render json: @level_mapping_service.get_role_without_level_mapping
  end

  def index
  end

  def get_title_mapping_for_new_level_mapping
    params = level_mapping_params
    role_id = params[:role_id]
    render json: @level_mapping_service.get_title_mapping_for_new_level_mapping(role_id)
  end

  def get_title_mapping_for_edit_level_mapping
    params = level_mapping_params
    role_id = params[:role_id]
    render json: @level_mapping_service.get_title_mapping_for_edit_level_mapping(role_id)
  end

  def add
    @role = Role.find_by_id(params[:role_id])
    title = Title.where(role_id: @role.id).order(:rank)
    count_competencies =  Competency.includes(:template).where("templates.role_id": @role.id).count
    competencies = Competency.joins(:template).where("templates.role_id": @role.id).order(:location)
    @list_title = {
      data: title.where(status: 0),
      data_real: title,
      no_rank: title.count,
      count_competency: count_competencies,
      competency: competencies,
    }
  end

  def edit
    @role = Role.find_by_id(params[:role_id])
    level_mappings = LevelMapping.includes(:title).where("titles.role_id": params[:role_id]).order("titles.rank", :level, :rank_number, :competency_type)
    title = Title.where(role_id: @role.id).order(:rank)
    count_competencies =  Competency.includes(:template).where("templates.role_id": @role.id).count
    competencies = Competency.joins(:template).where("templates.role_id": @role.id).order(:location)    
    @list_level_mapping = {
      data: level_mappings,
      rank: title.count,
      count_competency: count_competencies,
      competency: competencies,
      title: title,
    }
  end

  def save_level_mapping
    return render json: { status: "fail" } unless can_edit?
    return render json: { status: "success" } if @level_mapping_service.save_level_mapping
    render json: { status: "fail" }
  end

  def delete_level_mapping
    return render json: { status: "fail" } unless can_edit?
    return render json: { status: "success" } if @level_mapping_service.delete_level_mapping(params)
    render json: { status: "fail" }
  end

  def save_title_mapping
    return render json: { status: "fail" } unless can_edit?
    return render json: { status: "success" } if @level_mapping_service.save_title_mapping(params)
    render json: { status: "fail" }
  end

  def update_title_mapping
    return render json: { status: "fail" } unless can_edit?
    return render json: { status: "success" } if @level_mapping_service.update_title_mapping(params)
    render json: { status: "fail" }
  end

  def edit_title_mapping
    return render json: { status: "fail" } unless can_edit?
    render json: @level_mapping_service.edit_title_mapping(params)
  end

  def can_edit?
    @privilege_array.include?(FULL_ACCESS_ON_LEVEL_MAPPING)
  end

  def can_view?
    @privilege_array.include?(VIEW_LEVEL_MAPPING)
  end

  helper_method :can_view?, :can_edit?

  private

  def check_privilege
    redirect_to root_path unless (@privilege_array & [FULL_ACCESS_ON_LEVEL_MAPPING, VIEW_LEVEL_MAPPING]).any?
  end

  def level_mapping_service
    @level_mapping_service ||= Api::LevelMappingService.new(level_mapping_params, current_user)
  end

  def level_mapping_params
    params.permit(:id, :role_id, :id_level, :title_id, :level, :quantity, :type, :rank,:list,:level_mapping_id)
  end
end
