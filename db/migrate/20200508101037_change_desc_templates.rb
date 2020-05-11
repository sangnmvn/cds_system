class ChangeDescTemplates < ActiveRecord::Migration[6.0]
  def change
    rename_column :templates, :desc, :description
  end
end
