class CreateCompetencies < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :competencies do |t|
      t.text :name
      t.text :desc
      t.string :_type
      t.belongs_to :template, null: false, foreign_key: true
      t.integer :location
      #t.has_many :slots
      #t.has_many :title_competency_mappings

      t.timestamps
    end
  end
end
