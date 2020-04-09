class CreateTitleCompetencyMappings < ActiveRecord::Migration[6.0]
  def change
    create_table :title_competency_mappings do |t|
      t.integer :min_level_ranking
    end
  end
end
