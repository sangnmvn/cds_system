class AddCreatedByToRoles < ActiveRecord::Migration[6.0]
  def change
    add_column :roles, :updated_by, :bigint
  end
end
