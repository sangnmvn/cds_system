class AddLocationToCompetencies < ActiveRecord::Migration[6.0]
  def change
    add_column :competencies, :location, :integer
  end
end
