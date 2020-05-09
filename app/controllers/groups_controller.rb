class GroupsController < ApplicationController
  before_action :set_group, only: [:show, :edit, :update, :destroy]
  layout "system_layout"
  include Authorize
  before_action :get_privilege_id
  before_action :redirect_to_index, :if => :check_privelege
  # GET /groups
  # GET /groups.json
  def index
      @groups = Group.all.order(:id => :desc).where(is_delete: false)
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
    # binding.pry
    if Group.where(name: params[:name]).present?
      render :json => { :status => "exist" }
    else
      if @group.save
        status_group = @group.status ? "Enable" : "Disable"
        render :json => { :status => "success", id: @group.id, name: @group.name, status_group: status_group, desc: @group.description }
      else
        render :json => { :status => "fail" }
      end
    end
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    respond_to do |format|
      if Group.where.not(id: params[:id]).where(name: params[:name]).present?
        format.json { render :json => { :status => "exist" } }
      else
        params[:status] = params[:status] == "Enable" ? 1 : 0
        if @group.update(group_params)
          status_group = @group.status ? "Enable" : "Disable"
          format.json { render :json => { :status => "success", id: @group.id, name: @group.name, status_group: status_group, desc: @group.description } }
        else
          format.json { render :json => { :status => "fail" } }
        end
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    respond_to do |format|
      @group = Group.find(params[:id])
      if @group.update_attribute(:is_delete,true)
        status_group = @group.status ? "Enable" : "Disable"
          format.json { render :json => { :status => "success", id: @group.id, name: @group.name, status_group: status_group, desc: @group.description } }
        else
          format.json { render :json => { :status => "fail" } }
        end
      end
  end
  def get_data
    # binding.pry
    group = Group.where(id: params[:id])
    render :json => { group: group }
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
      id=[]
    @group.each do |group|
      group.update_attribute(:is_delete,true)
      id << group.id
    end
   
    respond_to do |format|
      index = params[:index]
      format.json { render :json => {id: id , index: index } }
    end

  end
  end

  private
  def check_privelege
    if @privilege_array.include? 4 or @privilege_array.include? 5
      return false
    else
      return true
    end
  end
  
  def redirect_to_index
      respond_to do |format|
        format.html { redirect_to  index2_admin_users_path}
      end
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
