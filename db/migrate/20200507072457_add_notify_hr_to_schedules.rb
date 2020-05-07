class AddNotifyHrToSchedules < ActiveRecord::Migration[6.0]
  def change
    add_column :schedules, :notify_hr, :string
  end
end
