class AddTypeToSchedules < ActiveRecord::Migration[6.0]
  def change
    add_column :schedules, :_type, :string
  end
end
