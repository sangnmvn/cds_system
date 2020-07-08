class CreateRoles < ActiveRecord::Migration[6.0]
  def change
    #done
    create_table :roles do |t|
      t.text :name
      t.text :desc
      t.text :description
      t.string :note
      t.boolean :status, default: 1
      t.timestamps
    end
  end
end
