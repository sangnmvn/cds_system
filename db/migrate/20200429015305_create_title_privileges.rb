class CreateTitlePrivileges < ActiveRecord::Migration[6.0]
  def change
    create_table :title_privileges do |t|
      t.string :Name
      
      t.timestamps
    end
  end
end
