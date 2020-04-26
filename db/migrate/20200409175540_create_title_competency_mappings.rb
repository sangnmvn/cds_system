class CreateTitleCompetencyMappings < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :title_competency_mappings do |t|
      t.integer :min_level_ranking
      t.belongs_to :title, foreign_key: true
      t.belongs_to :competency, foreign_key: true
    end
  end
end
