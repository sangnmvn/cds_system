ActiveAdmin.register AdminUser, as: "Staff" do
  menu false
  permit_params :email, :password, :password_confirmation

  index do
    selectable_column
    # id_column
    column :email
    # column :current_sign_in_at
    # column :sign_in_count
    column :first_name
    column :last_name
    # column :company_id
    column "Deparment", :role_id
    column "Level"
    column "Title"
    # column :created_at
    # actions
    actions defaults: false do |u|
      a "Show", href: admin_staff_path(u)
      a "Edit", href: edit_admin_staff_path(u)
    end
  end

  # scope :all
  filter :email, :as => :string
  filter :company_id, :as => :select
  filter :role_id, :as => :select
  # filter :current_sign_in_at
  # filter :sign_in_count
  # filter :created_at

  form do |f|
    f.inputs do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end
end
