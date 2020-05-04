class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :projects do |t|
      t.text :desc
      t.belongs_to :company, foreign_key: true
      t.timestamps
    end
  end
end
