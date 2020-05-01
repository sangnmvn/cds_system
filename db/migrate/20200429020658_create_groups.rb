class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups do |t|
      t.string :name
      t.boolean :status
      t.text :description

      t.timestamps
    end
  end
end
