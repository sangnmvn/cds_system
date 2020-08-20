class AddReUpdateToComments < ActiveRecord::Migration[6.0]
  def change
    add_column :comments, :re_update, :boolean, default: false 
  end
end
