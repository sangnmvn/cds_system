class ApplicationController < ActionController::Base
  before_action :authenticate_admin_user!

  module Authorize
    private

    def get_privilege_id
      @privilege_array = [0]
      if current_admin_user.id != 1
        user_group = UserGroup.where(admin_user_id: current_admin_user.id)

        user_group.each { |x|
          group = Group.where(id: x.group_id)

          group.each { |z|
            if z.status == true && z.is_delete == false
              group_privilege = GroupPrivilege.where(group_id: x.group_id)

              group_privilege.each { |y|
                @privilege_array.push(y.privilege_id)
              }
            end
          }
        }
      else
        @privilege_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      end
    end
  end
end
