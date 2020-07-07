class CreateForms < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :forms do |t|
      t.string :_type
      t.boolean :is_approved, default: false
      t.references :template
      t.belongs_to :period, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.integer :number_keep, default: 0
      t.integer :period_keep, default: 0
      t.timestamps
    end
  end
end
