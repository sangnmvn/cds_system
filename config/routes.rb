Rails.application.routes.draw do
  resources :user_groups do
    collection do
      get "load_user_group"
      get "load_user"
      get "load_group"
      get "save_user_group"
    end
  end
  resources :group_privileges
  resources :privileges
  resources :title_privileges
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
      delete "destroy_multiple"
    end
  end
  resources :templates do
    collection do
      get "add"
    end
  end
  resources :competencies do
    collection do
      # post "create"
    end
  end

  root to: "admin_users#index"

  get "/user_data/" => "admin_users#get_user_data", defaults: { format: "json" }

  # resources :admin_users

  resources :schedules do
    collection do
      delete "destroy_multiple"
    end
  end
  get "/schedules/:id/edit_page", to: "schedules#edit_page"
  get "/schedules/:id/destroy_page", to: "schedules#destroy_page"

  post "/admin/user_management/:id/edit" => "admin_users#get_modal_edit_users_management", as: :edit_user_management
  post "admin/user_management/add_reviewer/:id" => "admin_users#add_reviewer", as: :add_reviewer_user_management
  post "admin/user_management/add_reviewer/:id/:approver_ids" => "admin_users#add_reviewer_to_database"
  get "user_groups/show_privileges/:id", to: "user_groups#show_privileges", as: "show_privileges"
  post "user_groups/save_privileges", to: "user_groups#save_privileges", as: "save_privileges"
  delete "admin/user_management/:id" => "admin_users#destroy", as: :destroy_user_management

  get "/groups/:id/destroy_page", to: "groups#destroy_page"
  # resources :groups
  # get "groups" => "groups#index"
end
