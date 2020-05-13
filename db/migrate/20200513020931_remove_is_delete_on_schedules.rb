class RemoveIsDeleteOnSchedules < ActiveRecord::Migration[6.0]
  def change
    remove_column :schedules, :is_delete
  end
end
