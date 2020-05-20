class CreateSlots < ActiveRecord::Migration[6.0]
  # done
  def change
    create_table :slots do |t|
      t.text :desc
      t.text :evidence
      t.string :level
      t.belongs_to :competency, foreign_key: true
      t.string :slot_id
      t.timestamps
    end
  end
end
