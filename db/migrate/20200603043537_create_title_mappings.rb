class CreateTitleMappings < ActiveRecord::Migration[6.0]
  def change
    create_table :title_mappings do |t|
      t.integer :value
      t.integer :updated_by

      t.references :title
      t.references :competency

      t.timestamps
    end
  end
end
