class ChangeProjectIdOnSchedules < ActiveRecord::Migration[6.0]
  def change
    change_column_null :schedules, :project_id, true
  end
end
