class ChangeColumnFromSlots < ActiveRecord::Migration[6.0]
  def change
    remove_column :slots, :evidence
    rename_column :slots, :desc, :evidence
    rename_column :slots, :name, :desc
  end
end
