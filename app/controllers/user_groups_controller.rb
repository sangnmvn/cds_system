class UserGroupsController < ApplicationController
  layout "system_layout"

  def index
  end

  def load_user
    user_groups = UserGroup.where(group_id: params[:id]).pluck(:user_id)
    list_user = User.where(is_delete: false, status: true).where.not(id: user_groups)
    render json: list_user
  end

  def load_group
    group = Group.find_by_id(params[:id])
    render json: group
  end

  def load_user_group
    user_groups = UserGroup.includes(:group, :user).where(group_id: params[:id])
    arr = Array.new
    user_groups.each { |user_group|
      arr << {
        id: user_group.id,
        group_name: user_group.group.name,
        user_id: user_group.user_id,
        group_id: user_group.group_id,
        first_name: user_group.user.first_name,
        last_name: user_group.user.last_name,
        email: user_group.user.email,
      }
    }
    render json: arr
  end

  def save_user_group
    list_users = params[:list]
    id_group = params[:id]
    UserGroup.delete_by(group_id: id_group)
    if list_users.present?
      list_users.each { |user|
        UserGroup.create(group_id: id_group, user_id: user)
      }
    end
    @group = Group.find_by_id(params[:id])
    number = UserGroup.where(group_id: @group.id).count
    status_group = @group.status ? "Enable" : "Disable"

    render :json => { number: number, id: @group.id, name: @group.name, status_group: status_group, desc: @group.description }
  end

  def show_privileges
    group_pri = Group.find_by_id(params[:id]).privileges&.split(",") || []
    table_right = group_pri.uniq.map { |pri_id| Settings.privileges[pri_id].to_json }
    table_left = Settings.privileges.map { |k, value| value.to_json } - table_right
    render json: { left: table_left, right: table_right }
  end

  def save_privileges
    group_id = params[:group_id]
    data = params[:data]&.join(",") || ""
    Group.where(id: group_id).update(privileges: data)
  end
end
