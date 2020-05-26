class AddColumnsToForms < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :level, :int
    add_column :forms, :rank, :int
    add_reference :forms, :title, foreign_key: true
    add_reference :forms, :role, foreign_key: true
    add_column :forms, :status, :string
  end
end
