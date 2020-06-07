module Api
  class LevelMappingService < BaseService
    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_role_without_level_mapping
      roles = Role.left_joins([titles: [:level_mappings]]).select(:id, :name).distinct.where("level_mappings.id": nil)
      roles.map do |role|
        {
          role_id: role.id,
          role_name: role.name,
        }
      end
    end

    def get_title_mapping_for_new_level_mapping
      title_mappings = TitleMapping.joins([title: [:level_mappings]], :competency).select("titles.name", "titles.rank", "level_mappings.level", "competencies.name as competency_name", "competencies.id as competency_id", "value")

      title_mappings.map do |title_mapping|
        {
          title: title_mapping.name,
          rank: title_mapping.rank,
          level: title_mapping.level,
          competency_name: title_mapping.competency_name,
          competency_id: title_mapping.competency_id,
          value: title_mapping.value,

        }
      end
    end

    def get_data_level_mapping
      level_mappings = Role.joins([titles: [level_mappings: [:user]]])
        .select(:id, :level, :name, :first_name, :last_name,
                "max(rank_number) as no_rank", "MAX(level_mappings.updated_at) as updated_at_max")
        .group(:id, :level, :name, :first_name, :last_name, :updated_by)
        .order("MAX(level_mappings.updated_at)")

      level_mappings.map.each_with_index do |level_mapping, index|
        title_mapping = Title.joins(:role, [title_mappings: [:user]])
          .where("roles.id": level_mapping.id)
          .select(:id, :name, :first_name, :last_name,
                  "title_mappings.updated_at as updated_at_max")
          .order("title_mappings.updated_at": :desc).limit(1).first

        if !title_mapping.nil? && title_mapping.updated_at_max > level_mapping.updated_at_max
          final_updated_at_max = title_mapping.updated_at_max
          updated_by_person_name = title_mapping.first_name + " " + title_mapping.last_name
        else
          final_updated_at_max = level_mapping.updated_at_max
          updated_by_person_name = level_mapping.first_name + " " + level_mapping.last_name
        end
        {
          no: index + 1,
          role: level_mapping.name,
          no_rank: level_mapping.no_rank,
          level: level_mapping.level,
          latest_update: final_updated_at_max&.strftime("%b %d %Y"),
          updated_by: updated_by_person_name,
          role_id: level_mapping.id,
        }
      end
    end
        
    def save_level_mapping
      
      if params[:id_level]
        level_mapping = LevelMapping.find(params[:id_level])
        level_mapping.update(table_level_mapping_params)
      else
        LevelMapping.create!(table_level_mapping_params)
      end
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
