class CreateRoles < ActiveRecord::Migration[6.0]
  def change
    #done
    create_table :roles do |t|
      t.text :name
      t.text :desc

      t.timestamps
    end
  end
end
