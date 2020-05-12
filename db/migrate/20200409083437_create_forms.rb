class CreateForms < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :forms do |t|
      t.string :_type
      t.references :template
      #t.has_many :form_slots
      #t.has_many :periods
      #t.has_many :form_histories
      t.belongs_to :period, foreign_key: true
      t.belongs_to :admin_user, foreign_key: true
      #t.references :user_id, null: false, foreign_key: true
      t.timestamps
    end
  end
end
