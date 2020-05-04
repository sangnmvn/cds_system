class AddIsDeleteToAdminUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :admin_users, :is_delete, :boolean, default: false
  end
end
