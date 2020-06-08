module Api
  class LevelMappingService < BaseService
    include TitleMappingsHelper

    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_role_without_level_mapping
      roles = Role.select(:id, :name).where(updated_by: nil)
      roles.map do |role|
        {
          role_id: role.id,
          role_name: role.name,
        }
      end
    end

    def get_title_mapping_for_new_level_mapping(role_id)
      title_mappings = Title.joins(role: [templates: [:competencies]])
        .select(:id, :name, :rank, "competencies.name as competency_name", "competencies.id as competency_id", "max(templates.updated_at)")
        .group(:id, :name, :rank, "competencies.name", "competencies.id")
        .where(role_id: role_id)

      title_mappings.map do |title_mapping|
        {
          title: title_mapping.name,
          rank: title_mapping.rank,
          competency_name: title_mapping.competency_name,
          competency_id: title_mapping.competency_id,
          title_id: title_mapping.id,
        }
      end
    end

    def get_data_level_mapping_list
      roles_with_level_mapping_list = Role.joins([titles: [:level_mappings]], :user)
        .select(:id, :name, :first_name, :last_name,
                "max(rank_number) as no_rank", :updated_by, "max(roles.updated_at) as updated_at_max")
        .group(:id, :name, :first_name, :last_name, :updated_by)
      roles_with_level_mapping_list.map.each_with_index do |level_mapping, index|
        final_updated_at = level_mapping.updated_at_max
        {
          no: index + 1,
          role: level_mapping.name,
          no_rank: level_mapping.no_rank,
          latest_update: final_updated_at&.strftime("%b %d %Y"),
          updated_by: level_mapping.first_name + " " + level_mapping.last_name,
          role_id: level_mapping.id,
        }
      end
    end

    def save_title_mapping(params)
      #{"0"=>{"value"=>"0-1", "title_id"=>"1", "competency_id"=>"3"}, "1"=>{"value"=>"0-1", "title_id"=>"1", "competency_id"=>"4"}
      current_user_id = current_user.id

      records = params["records"]
      all_title_ids = []
      all_title_ids = records.keys.collect { |key| records[key]["title_id"] }.uniq
      TitleMapping.where(title_id: all_title_ids).destroy_all
      records.each do |key, hash|
        processed_params = {
          value: TitleMappingsHelper.convert_value_title_mapping(hash["value"]),
          updated_by: current_user_id,
          title_id: hash["title_id"],
          competency_id: hash["competency_id"],
        }
        TitleMapping.create!(processed_params)
      end

      # update updated_by
      parent_role_id = Title.find(records["0"]["title_id"]).role_id
      role = Role.find(parent_role_id)
      role.updated_by = current_user_id
      role.save!
      true
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
