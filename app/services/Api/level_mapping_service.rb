module Api
  class LevelMappingService < BaseService
    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_data_level_mapping
      level_mappings = LevelMapping.joins([title: [:role]], :user).group([:title_id, :level, :updated_by]).select(:title_id, :level, "MAX(level_mappings.updated_at) as updated_at", :updated_by, "max(rank_number) as no_rank")

      level_mappings.map.each_with_index do |level_mapping, index|
        #max_updated_title = TitleMapping.select("MAX(updated_at) as updated_at").where(title_id: level_mapping.title_id)&.first&.updated_at
        #max_updated_title2 = level_mapping.updated_at
        final_update_date = [max_updated_title, max_updated_title2].max
        {
          no: index + 1,
          role: level_mapping.title&.role&.name,
          no_rank: level_mapping.no_rank,
          level: level_mapping.level,
          latest_update: final_update_date.strftime("%b %d %Y"),
          updated_by: level_mapping.user&.first_name + " " + level_mapping.user&.last_name,
          role_id: level_mapping.title&.role&.id,
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
