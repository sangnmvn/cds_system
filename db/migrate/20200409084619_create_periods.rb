class CreatePeriods < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :periods do |t|
      t.datetime :from_date
      t.datetime :to_date
      #t.references :form, null: false, foreign_key: true
      
      #t.has_many :comments
      #t.has_many :form_slot_trackings
      
      t.belongs_to :form, foreign_key: true

      t.string :status
      t.timestamps
    end
  end
end
