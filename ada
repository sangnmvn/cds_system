
[1mFrom:[0m /home/ngthduy/Documents/cds_system/app/admin/user_managements.rb:37 Admin::UserManagementController#add_users_management:

    [1;34m34[0m: [32mdef[0m [1;34madd_users_management[0m
    [1;34m35[0m:   password_default = [31m[1;31m"[0m[31mpassword[1;31m"[0m[31m[0m
    [1;34m36[0m:   management_default = [1;34m0[0m
 => [1;34m37[0m:   binding.pry
    [1;34m38[0m:   params.require([33m:admin_user[0m).permit([33m:email[0m)
    [1;34m39[0m: 
    [1;34m40[0m:   [1;34m# AdminUser.create!(email: params[:email][0], password: password_default, first_name: params[:first][0],[0m
    [1;34m41[0m:   [1;34m#                   last_name: params[:last][0], account: params[:account][0],[0m
    [1;34m42[0m:   [1;34m#                   company_id: params[:company][0], role_id: params[:role][0])[0m
    [1;34m43[0m:   [1;34m#   .project_members.create!(project_id: "1", is_managent: management_default)[0m
    [1;34m44[0m: [32mend[0m

