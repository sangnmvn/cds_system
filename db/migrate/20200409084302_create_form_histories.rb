class CreateFormHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :form_histories do |t|
      t.string :old_value
      t.string :new_value
      t.string :update_by
      t.belongs_to :form, foreign_key: true
      t.timestamps
    end
  end
end
