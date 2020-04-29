class CreatePrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :privileges do |t|
      t.string :Name
      t.references :title_privilege, null: false, foreign_key: true
      t.timestamps
    end
  end
end
