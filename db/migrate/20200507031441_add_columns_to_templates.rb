class AddColumnsToTemplates < ActiveRecord::Migration[6.0]
  def change
    add_column :templates, :status, :boolean, default: 0
    add_reference :templates, :admin_user, null: false, foreign_key: true
  end
end
