module Api
  class LevelMappingService < BaseService
    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_data_level_mapping
      level_mappings = Role.joins([titles: [level_mappings: [:user]]]) \
      .left_joins(titles: [:title_mapping]) \
      .select(:id, :level, :name, :first_name, :last_name, \
      "GREATEST(MAX(level_mappings.updated_at), COALESCE(MAX(title_mappings.updated_at), MAX(level_mappings.updated_at))) as updated_at_max", \
      "level_mappings.updated_by as updated_by", "max(rank_number) as no_rank") \
      .group(:id, :level, :name, :first_name, :last_name, :updated_by) 
      level_mappings.map.each_with_index do |level_mapping, index|        
        {
          no: index + 1,
          role: level_mapping.name,
          no_rank: level_mapping.no_rank,
          level: level_mapping.level,
          latest_update: level_mapping.updated_at_max&.strftime("%b %d %Y"),
          updated_by: level_mapping.first_name + " " + level_mapping.last_name,
          role_id: level_mapping.id,
        }
      end
    end

    def save_level_mapping
      @level_mapping = LevelMapping.create(table_level_mapping_params)
    end


    private

    attr_reader :params, :current_user

    def table_level_mapping_params
      {
        title_id: params[:title_id].to_i,
        level: params[:level].to_i,
        quantity: params[:quantity].to_i,
        competency_type: params[:type].to_i,
        rank_number: params[:rank].to_i,
        updated_by: @current_user.id,
      }
    end
  end
end
