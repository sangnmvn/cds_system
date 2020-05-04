class CreateGroupPrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :group_privileges do |t|
      t.references :group, null: false, foreign_key: true
      t.references :privilege, null: false, foreign_key: true
      t.timestamps
    end
  end
end
