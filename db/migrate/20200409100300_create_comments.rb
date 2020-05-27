class CreateComments < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :comments do |t|
      t.text :evidence
      t.integer :point, limit: 1
      t.boolean :is_commit
      t.string :flag

      t.belongs_to :form_slot, foreign_key: true

      t.timestamps
    end
  end
end
