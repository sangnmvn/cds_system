class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :companies do |t|
      t.text :name
      t.string :abbreviation
      t.date :establishment
      t.string :phone
      t.string :fax
      t.string :email
      t.string :website
      t.string :address
      t.text :desc
      t.string :ceo
      t.string :email_group_staff
      t.string :email_group_hr
      t.string :email_group_admin
      t.string :email_group_it
      t.string :email_group_fa
      t.string :tax_code
      t.text :note
      t.boolean :is_enabled, default: true
      t.references :parent_company
      t.timestamps
    end
  end
end
