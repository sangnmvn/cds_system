class AddTitleToAdminUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :admin_users, :title, :string, default: true
  end
end
