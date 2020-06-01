class CreateLineManagers < ActiveRecord::Migration[6.0]
  def change
    create_table :line_managers do |t|
      t.integer :given_point, limit: 1
      t.text :recommend
      t.integer :user_id
      t.boolean :final, default: false
      t.string :flag
      t.belongs_to :period, foreign_key: true
      t.belongs_to :form_slot, foreign_key: true

      t.timestamps
    end
  end
end
