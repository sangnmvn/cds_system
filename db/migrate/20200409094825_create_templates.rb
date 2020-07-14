class CreateTemplates < ActiveRecord::Migration[6.0]
  # done
  def change
    create_table :templates do |t|
      t.text :name
      t.text :description
      t.references :user, null: false, foreign_key: true
      t.belongs_to :role, foreign_key: true
      t.boolean :status, default: true

      #t.has_many :competencies
      t.timestamps
    end
  end
end
