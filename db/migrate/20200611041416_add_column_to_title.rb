class AddColumnToTitle < ActiveRecord::Migration[6.0]
  def change
    add_column :titles, :status, :boolean, default: true
  end
end
