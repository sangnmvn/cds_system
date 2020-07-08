class CreateSummaryComments < ActiveRecord::Migration[6.0]
  def change
    create_table :summary_comments do |t|
      t.belongs_to :period, foreign_key: true
      t.belongs_to :form, foreign_key: true
      t.references :line_manager, references: :users
      t.text :comment
      t.timestamps
    end
  end
end
