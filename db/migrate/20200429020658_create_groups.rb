class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups do |t|
      t.string :Name
      t.boolean :Status
      t.text :Description

      t.timestamps
    end
  end
end
