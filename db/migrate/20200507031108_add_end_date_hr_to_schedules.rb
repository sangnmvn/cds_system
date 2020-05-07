class AddEndDateHrToSchedules < ActiveRecord::Migration[6.0]
  def change
    add_column :schedules, :end_date_hr, :date
  end
end
