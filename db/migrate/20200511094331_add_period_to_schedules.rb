class AddPeriodToSchedules < ActiveRecord::Migration[6.0]
  def change
    add_reference :schedules, :period, null: true, foreign_key: true
  end
end
