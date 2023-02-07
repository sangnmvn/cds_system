class CreateJwtDenyLists < ActiveRecord::Migration[6.0]
  def change
    create_table :jwt_deny_lists do |t|
      t.string :jwt, null: false
      t.datetime :exp, null: false
      t.index :jwt
      t.timestamps
    end
  end
end
