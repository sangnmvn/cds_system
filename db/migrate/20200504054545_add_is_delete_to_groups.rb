class AddIsDeleteToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :is_delete, :boolean, default: false
  end
end
