module Api
  class UserGroupService < BaseService
    def initialize(params, current_user)
      @current_user = current_user
      @params = params
    end

    def data_avalable_user
      user_groups = UserGroup.where(group_id: params[:group_id]).pluck(:user_id)
      users = User.where(is_delete: false, status: true).where.not(id: user_groups)
      users.map do |user|
        {
          id: user.id,
          full_name: user.format_name_vietnamese,
          account: user.account,
          email: user.email,
        }
      end
    end

    def data_user_group
      user_groups = UserGroup.includes(:group, :user).where(group_id: params[:group_id])
      user_groups.map do |user_group|
        {
          id: user_group.user_id,
          full_name: user_group.user.format_name_vietnamese,
          account: user_group.user.account,
          email: user_group.user.email,
        }
      end
    end

    private

    attr_reader :current_user, :params
  end
end
