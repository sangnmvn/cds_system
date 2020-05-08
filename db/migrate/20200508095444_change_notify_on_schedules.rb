class ChangeNotifyOnSchedules < ActiveRecord::Migration[6.0]
  def up
    change_column :schedules, :notify_hr, :integer
    change_column :schedules, :notify_employee, :integer
    change_column :schedules, :notify_reviewer, :integer
  end

  def down
    change_column :schedules, :notify_hr, :string
    change_column :schedules, :notify_employee, :string
    change_column :schedules, :notify_reviewer, :string
  end
  
end
