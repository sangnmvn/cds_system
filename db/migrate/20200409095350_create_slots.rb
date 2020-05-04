class CreateSlots < ActiveRecord::Migration[6.0]
  # done
  def change
    create_table :slots do |t|
      t.text :name
      t.text :desc
      t.string :level
      t.belongs_to :competency, foreign_key: true
      #t.has_many :form_slots
      t.timestamps
    end
  end
end
