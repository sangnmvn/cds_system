class CreateLevelMappings < ActiveRecord::Migration[6.0]
  def change
    create_table :level_mappings do |t|
      t.integer :level
      t.integer :quantity
      t.string :competency_type
      t.integer :rank_number
      t.integer :updated_by

      t.references :title

      t.timestamps
    end
  end
end
