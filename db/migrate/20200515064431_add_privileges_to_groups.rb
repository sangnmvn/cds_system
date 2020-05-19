class AddPrivilegesToGroups < ActiveRecord::Migration[6.0]
  def change
    add_column :groups, :privileges, :string
  end
end
