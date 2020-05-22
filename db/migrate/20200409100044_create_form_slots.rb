class CreateFormSlots < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :form_slots do |t|
      t.belongs_to :form, foreign_key: true
      t.belongs_to :slot, foreign_key: true

      # t.has_many :comments
      # t.has_many :form_slot_trackings
      t.integer :is_passed

      t.timestamps
    end
  end
end
