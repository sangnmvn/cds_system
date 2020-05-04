Rails.application.routes.draw do
  resources :user_groups do
    collection do
      get "test"
    end
  end
  resources :group_privileges
  resources :privileges
  resources :title_privileges
  resources :schedules
  devise_for :admin_users
  devise_scope :admin_users do
    get "/admin_users/sign_out" => "devise/sessions#destroy"
  end
  resources :admin_users do
    collection do
      get "check_emai_account"
      get "edit"
      post "add"
      post "update"
      get "get_filter_company"
      get "get_filter_project"
      get "get_modal_project"
      post "status"
      post "submit_filter"
      post "delete_multiple_users"
      post "disable_multiple_users"
    end
  end
  resources :groups do
    collection do
      get "get_data"
    end
  end
  root to: "admin_users#index"

  get "/user_data/" => "admin_users#get_user_data", defaults: { format: 'json' }

  post "/admin/user_management/:id/edit" => "admin_users#get_modal_edit_users_management", as: :edit_user_management
  get "user_group" => "user_group#index"
  delete "admin/user_management/:id" => "admin_users#destroy", as: :destroy_user_management
  post "admin/user_management/add_previewer/:id" => "admin_users#add_previewer", as: :add_previewer_user_management

  post "admin/user_management/add_previewer/:id/:approver_ids" => "admin_users#add_previewer_to_database"

  # resources :groups
  # get "groups" => "groups#index"
end
