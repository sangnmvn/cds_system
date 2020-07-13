class CreateRoles < ActiveRecord::Migration[6.0]
  def change
    #done
    create_table :roles do |t|
      t.text :name
      t.text :desc
      t.text :abbreviation
      t.string :note
      t.boolean :is_enabled, default: true
      t.timestamps
    end
  end
end
