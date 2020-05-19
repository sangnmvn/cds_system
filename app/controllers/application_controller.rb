class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  LIMIT = 20
  PASSWORD_DEFAULT = "123QWEasd"

  module Authorize
    private

    def get_privilege_id
      current_user.id
      group = Group.joins(:user_group).where(user_groups: { user_id: current_user.id }).first
      @privilege_array = group.list_privileges
    end
  end
end
