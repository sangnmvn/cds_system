class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :projects do |t|
      t.text :desc
      t.string :abbreviation
      t.datetime :establishment
      t.string :closed_date
      t.string :project_manager
      t.string :customer
      t.string :sponsor
      t.string :email
      t.text :description
      t.string :note
      t.boolean :status, default: 1
      t.belongs_to :company, foreign_key: true
      t.timestamps
    end
  end
end
