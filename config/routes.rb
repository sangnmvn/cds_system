Rails.application.routes.draw do
  post "admin/dashboard" => "admin/dashboard#ajax_call"
  post "admin/user_management/filter" => "admin/user_management#filter_users_management"
  post "admin/user_management/add" => "admin/user_management#add_users_management"
  get "/admin/user_management/submit" => "admin/user_management#submit_filter_users_management"
  get "admin/user_management/search" => "admin/user_management#search_users_management"
  get "/admin/user_management/modal/company" => "admin/user_management#get_project_modal_users_management"
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
