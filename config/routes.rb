Rails.application.routes.draw do
  get "periods/show"
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
      post "get_list_cds_assessment_manager"
      get :preview_result
      get "preview_result"
      post :data_view_result
      post "get_competencies"
      post "get_competencies_reviewer"
      get "cds_assessment"
      get "cdp_assessment"
      get "index_cds_cdp"
      post "request_update_cds"
      get "get_assessment_staff"
      get "cds_cdp_review"
      get "cdp_review"
      get "get_slot_is_change"
      get "review_cds_assessment"
      post "get_cds_assessment"
      post "save_cds_assessment_staff"
      post "save_add_more_evidence"
      post "request_add_more_evidence"
      post "save_cds_assessment_manager"
      get "cds_review"
      post "submit"
      post "approve_cds"
      post "reject_cds"
      post "get_cds_histories"
      post "get_data_slot"
      get "get_filter"
      post "reviewer_submit"
      post "withdraw_cds"
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

  resources :level_mappings do
    collection do
      get "index"
      get "add"
      get "edit"
      post "delete_level_mapping"
      post "update_level_mapping"
      post "save_level_mapping"
      post "save_title_mapping"
      post "edit_title_mapping"
      get "get_data_level_mapping_list"
      get "get_role_without_level_mapping"
      get "get_title_mapping_for_new_level_mapping/:role_id", action: "get_title_mapping_for_new_level_mapping"
      get "get_title_mapping_for_edit_level_mapping/:role_id", action: "get_title_mapping_for_edit_level_mapping"
    end
  end

  root to: "dashboards#index"

  resources :dashboards do
    collection do
      post :data_users_by_gender
      post :data_users_by_role
      post :calulate_data_user_by_seniority
      post :calulate_data_user_by_title
      post :data_users_up_title
      post :data_users_keep_title
      post :data_filter
    end
  end
  get "/user_data/" => "users#get_user_data", defaults: { format: "json" }
  get "/schedule_data/" => "schedules#get_schedule_data", defaults: { format: "json" }
  # resources :users

  resources :schedules do
    collection do
      delete "destroy_multiple"
      get "add_page"
    end
    get "view_pm"
  end
  get "/schedules/:id/edit_page", to: "schedules#edit_page"
  get "/schedules/:id/destroy_page", to: "schedules#destroy_page"
  get "/schedules/get_schedule_hr_info/:id", to: "schedules#get_schedule_hr_info"

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
