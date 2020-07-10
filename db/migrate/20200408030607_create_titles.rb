class CreateTitles < ActiveRecord::Migration[6.0]
  #done
  def change
    create_table :titles do |t|
      t.text :name
      t.text :desc
      t.integer :rank
      t.string :code
      t.text :description
      t.string :note
      t.boolean :real_status, default: true
      t.belongs_to :role, foreign_key: true
    end
  end
end
