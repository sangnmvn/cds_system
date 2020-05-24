class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  LIMIT = 20
  PASSWORD_DEFAULT = "123QWEasd"

  private

  def get_privilege_id
    group = Group.joins(:user_group).where(user_groups: { user_id: current_user.id }).first
    @privilege_array = group.list_privileges
  end
end
