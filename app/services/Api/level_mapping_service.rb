module Api
  class LevelMappingService
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
  end
end
