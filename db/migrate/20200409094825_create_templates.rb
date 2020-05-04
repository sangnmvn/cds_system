class CreateTemplates < ActiveRecord::Migration[6.0]
  # done
  def change
    create_table :templates do |t|
      t.text :name
      t.text :desc
      t.belongs_to :role, foreign_key: true
      
      #t.has_many :competencies
      t.timestamps
    end
  end
end
