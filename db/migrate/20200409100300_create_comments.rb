class CreateComments < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :comments do |t|
      t.string :added_by
      t.text :contents

      t.belongs_to :form_slot, foreign_key: true
      t.belongs_to :period, foreign_key: true
      
      t.timestamps
    end
  end
end
