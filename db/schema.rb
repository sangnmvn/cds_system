# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_06_22_044408) do

  create_table "approvers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "approver_id"
    t.boolean "is_submit_cds", default: false
    t.boolean "is_submit_cdp", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_approver", default: false
    t.index ["approver_id"], name: "index_approvers_on_approver_id"
    t.index ["user_id"], name: "index_approvers_on_user_id"
  end

  create_table "comments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "evidence"
    t.integer "point", limit: 1
    t.boolean "is_commit"
    t.string "flag"
    t.bigint "form_slot_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["form_slot_id"], name: "index_comments_on_form_slot_id"
  end

  create_table "companies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "name"
    t.bigint "parent_company_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["parent_company_id"], name: "index_companies_on_parent_company_id"
  end

  create_table "competencies", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "name"
    t.text "desc"
    t.string "_type"
    t.bigint "template_id", null: false
    t.integer "location"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["template_id"], name: "index_competencies_on_template_id"
  end

  create_table "form_histories", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "old_value"
    t.string "new_value"
    t.string "update_by"
    t.bigint "form_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["form_id"], name: "index_form_histories_on_form_id"
  end

  create_table "form_slot_histories", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "point"
    t.text "evidence"
    t.integer "form_slot_id"
    t.integer "competency_id"
    t.string "slot_position"
    t.bigint "title_history_id", null: false
    t.bigint "slot_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["slot_id"], name: "index_form_slot_histories_on_slot_id"
    t.index ["title_history_id"], name: "index_form_slot_histories_on_title_history_id"
  end

  create_table "form_slots", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "form_id"
    t.bigint "slot_id"
    t.integer "is_passed"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_change"
    t.index ["form_id"], name: "index_form_slots_on_form_id"
    t.index ["slot_id"], name: "index_form_slots_on_slot_id"
  end

  create_table "forms", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "_type"
    t.boolean "is_approved", default: false
    t.bigint "template_id"
    t.bigint "period_id"
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "level"
    t.integer "rank"
    t.bigint "title_id"
    t.bigint "role_id"
    t.string "status"
    t.boolean "is_delete", default: false
    t.date "submit_date"
    t.date "review_date"
    t.index ["period_id"], name: "index_forms_on_period_id"
    t.index ["role_id"], name: "index_forms_on_role_id"
    t.index ["template_id"], name: "index_forms_on_template_id"
    t.index ["title_id"], name: "index_forms_on_title_id"
    t.index ["user_id"], name: "index_forms_on_user_id"
  end

  create_table "groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "name"
    t.boolean "status"
    t.text "description"
    t.boolean "is_delete", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "privileges"
  end

  create_table "level_mappings", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "level"
    t.integer "quantity"
    t.string "competency_type"
    t.integer "rank_number"
    t.integer "updated_by"
    t.bigint "title_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["title_id"], name: "index_level_mappings_on_title_id"
  end

  create_table "line_managers", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "given_point", limit: 1
    t.text "recommend"
    t.integer "user_id"
    t.boolean "final", default: false
    t.string "flag"
    t.bigint "period_id"
    t.bigint "form_slot_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_commit"
    t.index ["form_slot_id"], name: "index_line_managers_on_form_slot_id"
    t.index ["period_id"], name: "index_line_managers_on_period_id"
  end

  create_table "periods", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.date "from_date"
    t.date "to_date"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "project_members", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "project_id"
    t.boolean "is_managent"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_project_members_on_project_id"
    t.index ["user_id"], name: "index_project_members_on_user_id"
  end

  create_table "projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "desc"
    t.bigint "company_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id"], name: "index_projects_on_company_id"
  end

  create_table "roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "name"
    t.text "desc"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "updated_by"
  end

  create_table "schedules", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id"
    t.bigint "company_id"
    t.bigint "period_id"
    t.date "start_date"
    t.date "end_date_reviewer"
    t.date "end_date_employee"
    t.date "end_date_hr"
    t.integer "notify_reviewer"
    t.integer "notify_employee"
    t.integer "notify_hr"
    t.text "desc"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "_type"
    t.index ["company_id"], name: "index_schedules_on_company_id"
    t.index ["period_id"], name: "index_schedules_on_period_id"
    t.index ["project_id"], name: "index_schedules_on_project_id"
    t.index ["user_id"], name: "index_schedules_on_user_id"
  end

  create_table "slots", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "desc"
    t.text "evidence"
    t.string "level"
    t.bigint "competency_id"
    t.string "slot_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["competency_id"], name: "index_slots_on_competency_id"
  end

  create_table "summary_comments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "period_id"
    t.bigint "form_id"
    t.bigint "line_manager_id"
    t.text "comment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["form_id"], name: "index_summary_comments_on_form_id"
    t.index ["line_manager_id"], name: "index_summary_comments_on_line_manager_id"
    t.index ["period_id"], name: "index_summary_comments_on_period_id"
  end

  create_table "templates", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "name"
    t.text "description"
    t.bigint "user_id", null: false
    t.bigint "role_id"
    t.boolean "status", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["role_id"], name: "index_templates_on_role_id"
    t.index ["user_id"], name: "index_templates_on_user_id"
  end

  create_table "title_competency_mappings", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "min_level_ranking"
    t.bigint "title_id"
    t.bigint "competency_id"
    t.index ["competency_id"], name: "index_title_competency_mappings_on_competency_id"
    t.index ["title_id"], name: "index_title_competency_mappings_on_title_id"
  end

  create_table "title_histories", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "rank"
    t.string "title"
    t.integer "level"
    t.integer "user_id"
    t.string "role_name"
    t.bigint "period_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["period_id"], name: "index_title_histories_on_period_id"
  end

  create_table "title_mappings", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.integer "value"
    t.integer "updated_by"
    t.bigint "title_id"
    t.bigint "competency_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["competency_id"], name: "index_title_mappings_on_competency_id"
    t.index ["title_id"], name: "index_title_mappings_on_title_id"
  end

  create_table "titles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.text "name"
    t.text "desc"
    t.integer "rank"
    t.bigint "role_id"
    t.boolean "status"
    t.index ["role_id"], name: "index_titles_on_role_id"
  end

  create_table "user_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.bigint "group_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id"], name: "index_user_groups_on_group_id"
    t.index ["user_id"], name: "index_user_groups_on_user_id"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "last_name"
    t.string "first_name"
    t.string "account"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "is_delete", default: false
    t.boolean "status", default: true
    t.datetime "remember_created_at"
    t.datetime "joined_date"
    t.boolean "gender", default: true
    t.bigint "company_id"
    t.bigint "role_id"
    t.bigint "title_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "phone"
    t.string "skype"
    t.date "date_of_birth"
    t.string "nationality"
    t.text "permanent_address"
    t.text "current_address"
    t.string "identity_card_no"
    t.string "image"
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
    t.index ["title_id"], name: "index_users_on_title_id"
  end

  add_foreign_key "approvers", "users"
  add_foreign_key "comments", "form_slots"
  add_foreign_key "competencies", "templates"
  add_foreign_key "form_histories", "forms"
  add_foreign_key "form_slot_histories", "slots"
  add_foreign_key "form_slot_histories", "title_histories"
  add_foreign_key "form_slots", "forms"
  add_foreign_key "form_slots", "slots"
  add_foreign_key "forms", "periods"
  add_foreign_key "forms", "roles"
  add_foreign_key "forms", "titles"
  add_foreign_key "forms", "users"
  add_foreign_key "line_managers", "form_slots"
  add_foreign_key "line_managers", "periods"
  add_foreign_key "projects", "companies"
  add_foreign_key "schedules", "companies"
  add_foreign_key "schedules", "periods"
  add_foreign_key "schedules", "projects"
  add_foreign_key "schedules", "users"
  add_foreign_key "slots", "competencies"
  add_foreign_key "summary_comments", "forms"
  add_foreign_key "summary_comments", "periods"
  add_foreign_key "templates", "roles"
  add_foreign_key "templates", "users"
  add_foreign_key "title_competency_mappings", "competencies"
  add_foreign_key "title_competency_mappings", "titles"
  add_foreign_key "title_histories", "periods"
  add_foreign_key "titles", "roles"
  add_foreign_key "user_groups", "groups"
  add_foreign_key "user_groups", "users"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "roles"
end
