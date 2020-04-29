Rails.application.routes.draw do
  resources :user_groups do
    collection do
      get "test"
    end
  end
  resources :groups
  resources :group_privileges
  resources :privileges
  resources :title_privileges
  resources :schedules
  devise_for :admin_users
  devise_scope :admin_user do
    get "/admin_users/sign_out" => "devise/sessions#destroy"
  end
  resources :admin_users
  root to: "admin_user#index"
  get "user_management/edit" => "admin_user#get_data_edit"
  post "admin/dashboard" => "admin/dashboard#ajax_call"
  post "admin/user_management/filter" => "admin_user#filter_users_management"
  post "admin/user_management/add" => "admin_user#add_users_management"
  get "/admin/user_management/modal/company" => "admin_user#get_project_modal_users_management"
  post "/admin/user_management/submit/filter" => "admin_user#submit_filter_users_management"
  post "/admin/user_management/:id/edit" => "admin_user#get_modal_edit_users_management", as: :edit_user_management
  get "user_group" => "user_group#index"
  delete "admin/user_management/:id" => "admin_user#destroy", as: :destroy_user_management

  # resources :groups
  # get "groups" => "groups#index"
end
