module Api
  class LevelMappingService < BaseService
    include TitleMappingsHelper

    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_role_without_level_mapping
      #roles = Role.left_joins([titles: [:level_mappings]]).select(:id, :name).distinct.where("level_mappings.id": nil)
      roles = Role.select(:id, :name).where(updated_by: nil)
      roles.map do |role|
        {
          role_id: role.id,
          role_name: role.name,
        }
      end
    end

    def get_title_mapping_for_new_level_mapping(role_id)
      title_mappings = TitleMapping.joins([title: [:role]], :competency)
        .select("titles.name", "titles.rank", "competencies.name as competency_name", "competencies.id as competency_id", "value", "titles.id as title_id")
        .where("roles.id": role_id).distinct
      title_mappings.map do |title_mapping|
        {
          title: title_mapping.name,
          rank: title_mapping.rank,          
          competency_name: title_mapping.competency_name,
          competency_id: title_mapping.competency_id,
          value: TitleMappingsHelper.convert_value_title_mapping(title_mapping.value),
          title_id: title_mapping.title_id,
        }
      end
    end

    def get_data_level_mapping_list
      level_mappings = Role.joins([titles: [:level_mappings]], :user)
        .select(:id, :name, :first_name, :last_name,
                "max(rank_number) as no_rank", :updated_by, "max(roles.updated_at) as updated_at_max")
        .group(:id, :name, :first_name, :last_name, :updated_by)
      level_mappings.map.each_with_index do |level_mapping, index|
        final_updated_at_max = level_mapping.updated_at_max
        {
          no: index + 1,
          role: level_mapping.name,
          no_rank: level_mapping.no_rank,
          latest_update: final_updated_at_max&.strftime("%b %d %Y"),
          updated_by: level_mapping.first_name + " " + level_mapping.last_name,
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
