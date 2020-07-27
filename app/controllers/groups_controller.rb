class GroupsController < ApplicationController
  before_action :set_group, only: [:show, :edit, :update, :destroy]
  layout "system_layout"
  before_action :get_privilege_id
  before_action :redirect_to_index, only: [:index, :get_data, :show]
  FULL_ACCESS = 6
  VIEW = 7
  # GET /groups
  # GET /groups.json
  def index
    @groups = Group.all.order(:id => :desc).where(is_delete: false)
    @full_access = @privilege_array.include?(FULL_ACCESS)
    @view = @privilege_array.include?(VIEW)
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
    return render json: { status: "exist" } if Group.where(name: params[:name]).present?
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
    @group = Group.find(params[:id])
    if @group.update_attribute(:is_delete, true)
      UserGroup.delete_by(group_id: @group.id)
      status_group = @group.status ? "Enable" : "Disable"
      render json: { status: "success", id: @group.id, name: @group.name, status_group: status_group, desc: @group.description }
    else
      render json: { status: "fail" }
    end
  end

  def get_data
    group = Group.where(id: params[:id])
    render json: { group: group }
  end

  def destroy_page
    @group_destroy = Group.find(params[:id])

    respond_to do |format|
      format.js
    end
  end

  def destroy_multiple
    if params[:group_ids] != nil
      @group = Group.find(params[:group_ids])
      id = []
      @group.each do |group|
        group.update_attribute(:is_delete, true)
        UserGroup.delete_by(group_id: group.id)
        id << group.id
      end
      render json: { id: id }
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
