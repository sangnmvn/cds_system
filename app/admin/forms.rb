ActiveAdmin.register Form do

  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  permit_params :_type, :template_id, :admin_user_id
  #
  # or
  #
  # permit_params do
  #   permitted = [:_type, :template_id, :admin_user_id]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end
  form do |f|
    f.inputs do
      f.input :admin_user_id, label: "Admin User",
                              as: :select, collection: AdminUser.all.pluck(:email)
      f.input :_type
    end
    f.actions
  end
end
