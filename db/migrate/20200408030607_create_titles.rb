class CreateTitles < ActiveRecord::Migration[6.0]
  #done
  def change
    create_table :titles do |t|
      t.text :name
      t.text :desc
      t.integer :rank
      t.text :abbreviation
      t.string :note
      t.boolean :is_enabled, default: true
      t.belongs_to :role, foreign_key: true
    end
  end
end
