class AddColumnToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :phone, :string
    add_column :users, :skype, :string
    add_column :users, :date_of_birth, :date
    add_column :users, :nationality, :string
    add_column :users, :permanent_address, :text
    add_column :users, :current_address, :text
    add_column :users, :identity_card_no, :string
  end
end
