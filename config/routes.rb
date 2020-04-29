Rails.application.routes.draw do
  devise_for :admin_users
  devise_scope :admin_user do
    get '/admin_users/sign_out' => 'devise/sessions#destroy'
  end
  # resources :admin_users
  root to: "admin_user#index"
  post "admin/dashboard" => "admin/dashboard#ajax_call"
  post "admin/user_management/filter" => "admin_user#filter_users_management"
  post "admin/user_management/add" => "admin_user#add_users_management"
  get "/admin/user_management/modal/company" => "admin_user#get_project_modal_users_management"
  post "/admin/user_management/submit/filter" => "admin_user#submit_filter_users_management"
  post "/admin/user_management/:id/edit" => "admin_user#get_modal_edit_users_management", as: :edit_user_management
  get "user_group" => "user_group#index"

  delete "admin/user_management/:id" => "admin/user_management#destroy_user", as: :destroy_user_management
  get "admin/user_management/search" => "admin/user_management#search_users_management"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
