class CreateTitleHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :title_histories do |t|
      t.integer :rank
      t.string :title
      t.integer :level
      t.integer :user_id
      t.string :role_name

      t.belongs_to :period, foreign_key: true
      t.timestamps
    end
  end
end
