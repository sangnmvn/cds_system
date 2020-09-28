class UserGroupsController < ApplicationController
  layout :system_layout
  before_action :user_group_service

  def index
  end

  def data_assign_user
    available_users = @user_group_service.data_avalable_user
    selected_users = @user_group_service.data_user_group

    render json: { available_users: available_users, selected_users: selected_users }
  end

  def load_privileges
    group_pri = Group.find_by_id(params[:group_id]).privileges&.split(",") || []
    table_right = group_pri.uniq.map { |pri_id| Settings.privileges[pri_id].to_h }
    table_left = Settings.privileges.map { |_, value| value.to_h } - table_right

    render json: { left: table_left, right: table_right }
  end

  def save_user_group
    status = "success"
    status = "fails" unless UserGroup.delete_by(group_id: params[:group_id], user_id: params[:user_deletes])
    if params[:user_add]
      params[:user_add].each do |user_id|
        status = "fails" unless UserGroup.create(group_id: params[:group_id], user_id: user_id)
      end
    end
    render json: { status: status }
  end

  def show_privileges
    group_pri = Group.find_by_id(params[:id]).privileges&.split(",") || []
    table_right = group_pri.uniq.map { |pri_id| Settings.privileges[pri_id].to_json }
    table_left = Settings.privileges.map { |_, value| value.to_json } - table_right
    render json: { left: table_left, right: table_right }
  end

  def save_privileges
    group_id = params[:group_id]
    data = params[:data]&.join(",") || ""
    Group.where(id: group_id).update(privileges: data)
  end

  private

  def user_group_service
    @user_group_service ||= Api::UserGroupService.new(params, current_user)
  end
end
