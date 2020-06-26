class RenameBackTitleIdToBeTitleInForms < ActiveRecord::Migration[6.0]
  def change
    remove_column :forms, :title_id
    add_column :forms, :title, :string
  end
end
