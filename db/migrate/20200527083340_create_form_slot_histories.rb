class CreateFormSlotHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :form_slot_histories do |t|
      t.integer :point
      t.text :evidence
      t.integer :form_slot_id
      t.integer :competency_id
      t.string :slot_position
      
      t.references :title_history, null: false, foreign_key: true
      t.references :slot, null: false, foreign_key: true
      t.timestamps
    end
  end
end
