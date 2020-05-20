class CreatePeriods < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :periods do |t|
      t.date :from_date
      t.date :to_date

      t.string :status
      t.timestamps
    end
  end
end
