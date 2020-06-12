module Api
  class LevelMappingService < BaseService
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
        .select(:id, :name, :rank, "competencies.name as competency_name", "competencies.id as competency_id", "competencies.location as competency_location", "max(templates.updated_at)")
        .group(:id, :name, :rank, "competencies.name", "competencies.id", "competencies.location")
        .where(role_id: role_id).order(rank: :asc, "competencies.location": :asc)

      title_mappings.map do |title_mapping|
        {
          title: title_mapping.name,
          rank: title_mapping.rank,
          competency_name: title_mapping.competency_name,
          competency_id: title_mapping.competency_id,
          competency_location: title_mapping.competency_location,
          title_id: title_mapping.id,
        }
      end
    end

    def get_title_mapping_for_edit_level_mapping(role_id)
      title_ids = Title.where(role_id: role_id).pluck(:id)
      title_mappings = TitleMapping.includes(title: [role: [templates: [:competencies]]]).where(title_id: title_ids).order("titles.rank")

      title_mappings.map do |title_mapping|
        {
          title: title_mapping.title.name,
          rank: title_mapping.title.rank,
          competency_name: title_mapping.competency.name,
          competency_id: title_mapping.competency_id,
          competency_location: title_mapping.competency.location,
          title_id: title_mapping.title.id,
          value: convert_value_title_mapping(title_mapping.value),
        }
      end
    end

    def get_data_level_mapping_list
      roles_with_level_mapping_list = Role.joins([titles: [:level_mappings]], :user)
        .select(:id, :name, :first_name, :last_name,
                "max(titles.rank) as no_rank", :updated_by, "max(roles.updated_at) as updated_at_max")
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

      records = params[:records]
      all_title_ids = []
      all_title_ids = records.keys.collect { |key| records[key]["title_id"] }.uniq
      TitleMapping.where(title_id: all_title_ids).destroy_all
      records.each do |key, hash|
        processed_params = {
          value: convert_value_title_mapping(hash["value"]),
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
    end

    def edit_title_mapping(params)
      #{"0"=>{"value"=>"0-1", "title_id"=>"1", "competency_id"=>"3"}, "1"=>{"value"=>"0-1", "title_id"=>"1", "competency_id"=>"4"}
      current_user_id = current_user.id

      records = params["records"]
      records.each do |key, hash|
        processed_params = {
          value: convert_value_title_mapping(hash["value"]),
          updated_by: current_user_id,
          title_id: hash["title_id"],
          competency_id: hash["competency_id"],
        }
        current_title_mapping = TitleMapping.find_by(title_id: processed_params[:title_id], competency_id: processed_params[:competency_id])

        current_title_mapping.value = processed_params[:value]
        current_title_mapping.updated_by = processed_params[:updated_by]
        current_title_mapping.save!
      end

      # update updated_by
      parent_role_id = Title.find(records["0"]["title_id"]).role_id
      role = Role.find_by_id(parent_role_id)
      role.updated_by = current_user_id
      role.save!
    end

    def save_level_mapping(params)
      list_new = params[:list_new]
      if list_new.present?
        list_new.each do |item|
          level_mapping = {
            title_id: item[1][0],
            level: item[1][1],
            quantity: item[1][2],
            competency_type: item[1][3],
            rank_number: item[1][4],
            updated_by: @current_user.id,
          }
          return "fail" unless LevelMapping.create!(level_mapping)
        end
      end
      list_del = params[:list_del]
      if list_del.present?
          return "fail" unless LevelMapping.where(id: list_del).destroy_all
      end
      list_edit = params[:list_edit]
      if list_edit.present?
        list_edit.each do |item|
          level_mapping = LevelMapping.find_by_id(item[1][0].to_i)
          level_mapping.quantity = item[1][1].to_i
          level_mapping.competency_type = item[1][2]
          level_mapping.rank_number = item[1][3].to_i
          return "fail" unless level_mapping.save
        end
      end
      "success"
    end

    private

    attr_reader :params, :current_user

    def table_level_mapping_params
      type = case params[:type]
        when "1"
          "General"
        when "2"
          "Specialized"
        else
          "All"
        end

      {
        title_id: params[:title_id].to_i,
        level: params[:level].to_i,
        quantity: params[:quantity].to_i,
        competency_type: type,
        rank_number: params[:rank].to_i,
        updated_by: @current_user.id,
      }
    end
  end
end
