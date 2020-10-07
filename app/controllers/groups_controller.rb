class GroupsController < ApplicationController
  before_action :set_group, only: %i[show edit update destroy]
  layout "system_layout"
  before_action :get_privilege_id
  before_action :redirect_to_index, only: %i[index load_data_groups show]
  FULL_ACCESS = 6
  VIEW = 7
  # GET /groups
  # GET /groups.json
  def index
    @full_access = @privilege_array.include?(FULL_ACCESS)
    @view = @privilege_array.include?(VIEW)
  end

  def load_data_groups
    groups = Group.select(:id, :name, :description, :status).where(is_delete: false).order(created_at: :desc)
    h_count = Group.joins(:user_group).where(is_delete: false).group("user_groups.group_id").count
    data = groups.map do |group|
      {
        id: group.id,
        name: group.name,
        description: group.description,
        number_users: h_count[group.id] || 0,
        status: group.status ? "Enable" : "Disable",
      }
    end
    render json: { data: data }
  end

  # GET /groups/1
  # GET /groups/1.json
  def show
  end

  # GET /groups/new
  def new
    @group = Group.new
  end

  # GET /groups/1/edit
  def edit
  end

  # POST /groups
  # POST /groups.json
  def create
    params[:status] = params[:status] == "Enable" ? 1 : 0
    @group = Group.new(group_params)
    group = Group.find_by_name(params[:name])
    return render json: { status: "exist" } if group.present?

    if @group.save
      status_group = @group.status ? "Enable" : "Disable"
      render json: { status: "success", id: @group.id, name: @group.name, status_group: status_group, desc: @group.description }
    else
      render json: { status: "fail" }
    end
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    return render json: { status: "exist" } if Group.where.not(id: params[:id]).where(name: params[:name]).present?

    params[:status] = params[:status] == "Enable" ? 1 : 0
    if @group.update(group_params)
      status_group = @group.status ? "Enable" : "Disable"
      number = UserGroup.where(group_id: @group.id).count
      render json: { status: "success", number: number, id: @group.id, name: @group.name, status_group: status_group, desc: @group.description }
    else
      render json: { status: "fail" }
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group = Group.find_by_id(params[:id])
    render json: { status: "fail" } unless UserGroup.where(group_id: @group.id).blank?
    if @group.update_attribute(:is_delete, true)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  private

  def redirect_to_index
    redirect_to root_path unless (@privilege_array & [FULL_ACCESS, VIEW]).any?
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_group
    @group = Group.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def group_params
    params.permit(:id, :name, :status, :description)
  end
end
