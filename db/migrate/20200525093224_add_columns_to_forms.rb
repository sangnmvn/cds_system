class AddColumnsToForms < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :level, :int
    add_column :forms, :rank, :int
    add_reference :forms, :title, foreign_key: true
    add_reference :forms, :role, foreign_key: true
    add_column :forms, :status, :string
    add_column :forms, :is_delete, :boolean, default: false
    add_column :forms, :submit_date, :date
    add_column :forms, :approved_date, :date
  end
end
