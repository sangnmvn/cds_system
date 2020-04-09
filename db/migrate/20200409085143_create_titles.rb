class CreateTitles < ActiveRecord::Migration[6.0]
  def change
    create_table :titles do |t|
      t.string :name
      t.text :desc
    end
  end
end
