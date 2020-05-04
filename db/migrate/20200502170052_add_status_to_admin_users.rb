class AddStatusToAdminUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :admin_users, :status, :boolean, default: true
  end
end
