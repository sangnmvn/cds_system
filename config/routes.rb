Rails.application.routes.draw do
  get 'periods/show'
  devise_for :users
  resources :user_groups do
    collection do
      get "load_user_group"
      get "load_user"
      get "load_group"
      get "save_user_group"
    end
  end
  # devise_for :users
  devise_scope :users do
    get "/users/sign_out" => "devise/sessions#destroy"
  end
  resources :users do
    collection do
      get "check_emai_account"
      get "edit"
      get "index2"
      post "create"
      post "update"
      get "get_filter_company"
      get "get_filter_project"
      get "get_modal_project"
      post "status"
      post "submit_filter"
      post "delete_multiple_users"
      post "disable_multiple_users"
      post "enable_multiple_users"
    end
  end

  resources :periods do
    collection do
    end
  end
  resources :groups do
    collection do
      get "get_data"
      delete "destroy_multiple"
    end
  end
  resources :forms do
    collection do
      get "get_list_cds_assessment"
      get "preview_result"
      post "get_competencies"
      get "cds_assessment"
      post "get_cds_assessment"
      post "save_cds_assessment_staff"
      post "save_cds_assessment_manager"
    end
  end
  resources :templates do
    collection do
      get "add"
      post "delete/:id", to: "templates#delete", as: "delete"
    end
  end
  resources :slots do
    collection do
      get "load"
      get "new"
      get "delete"
      get "check_slot_in_template"
      get "update"
      get "update_status_template"
      get "change_slot_id"
      get "load_competency"
      get "get_role"
    end
  end
  resources :competencies do
    collection do
      # post "create"
      get "load"
      get "edit"
      post "change_location"
      get "check_privileges"
    end
  end

  root to: "users#index2"

  get "/user_data/" => "users#get_user_data", defaults: { format: "json" }

  # resources :users

  resources :schedules do
    collection do
      delete "destroy_multiple"
    end
    get "view_pm"
  end
  get "/schedules/:id/edit_page", to: "schedules#edit_page"
  get "/schedules/:id/destroy_page", to: "schedules#destroy_page"

  post "/admin/user_management/:id/edit" => "users#get_modal_edit_users_management", as: :edit_user_management
  post "/admin/user_management/add_reviewer/:id" => "users#add_reviewer", as: :add_reviewer_user_management
  post "/admin/user_management/add_reviewer/:id/:approver_ids" => "users#add_reviewer_to_database"
  get "user_groups/show_privileges/:id", to: "user_groups#show_privileges", as: "show_privileges"
  post "user_groups/save_privileges", to: "user_groups#save_privileges", as: "save_privileges"
  delete "admin/user_management/:id" => "users#destroy", as: :destroy_user_management
  get "templates/:id/:ext" => "templates#export_excel"

  delete "templates/cleanup/:excel_filename" => "templates#cleanup_excel_file"

  get "/groups/:id/destroy_page", to: "groups#destroy_page"
  # resources :groups
  # get "groups" => "groups#index"
end
