class CreateSchedules < ActiveRecord::Migration[6.0]
  def change
    create_table :schedules do |t|
      t.references :admin_user, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true
      t.datetime :start_date
      t.datetime :end_date
      t.string :notify_date

      t.timestamps
    end
  end
end
