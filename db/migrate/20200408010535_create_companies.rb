class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :companies do |t|
      t.text :name
      t.references :parent_company
      t.timestamps
    end
  end
end
