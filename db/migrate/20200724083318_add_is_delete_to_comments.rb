class AddIsDeleteToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :is_delete, :boolean, default: false
  end
end
