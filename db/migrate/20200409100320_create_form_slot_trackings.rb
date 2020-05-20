class CreateFormSlotTrackings < ActiveRecord::Migration[6.0]
  def change
    create_table :form_slot_trackings do |t|
      t.integer :self_assert_point
      t.integer :given_point

      t.belongs_to :period, foreign_key: true
      t.belongs_to :form_slot, foreign_key: true
      t.integer :is_commit
      
      t.timestamps
    end
  end
end
