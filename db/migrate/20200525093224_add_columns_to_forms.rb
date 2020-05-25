class AddColumnsToForms < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :level, :int
    add_column :forms, :rank, :int
  end
end
