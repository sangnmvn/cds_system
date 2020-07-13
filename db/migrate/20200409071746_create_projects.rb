class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :projects do |t|
      t.text :name
      t.text :desc
      t.string :abbreviation
      t.date :establishment
      t.date :closed_date
      t.string :project_manager
      t.string :customer
      t.string :sponsor
      t.string :email
      t.string :note
      t.boolean :is_enabled, default: true
      t.belongs_to :company, foreign_key: true
      t.timestamps
    end
  end
end
