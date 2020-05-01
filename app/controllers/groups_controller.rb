class GroupsController < ApplicationController
  before_action :set_group, only: [:show, :edit, :update, :destroy]
  layout "system_layout"

  # GET /groups
  # GET /groups.json
  def index
    @groups = Group.all
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
    params[:Status] = params[:Status] == "Enable" ? 1 : 0
    @group = Group.new(group_params)
    # binding.pry
    if Group.where(Name: params[:Name]).present?
      render :json => { :status => "exist" }
    else
      if @group.save
        render :json => { :status => "success" }
      else
        render :json => { :status => "fail" }
      end
    end
  end

  # PATCH/PUT /groups/1
  # PATCH/PUT /groups/1.json
  def update
    # binding.pry
    respond_to do |format|
      if Group.where.not(id: params[:id]).where(Name: params[:Name]).present?
        format.json { render :json => { :status => "exist" } }
      else
        params[:Status] = params[:Status] == "Enable" ? 1 : 0
        if @group.update(group_params)
          format.json { render :json => { :status => "success" } }
        else
          format.json { render :json => { :status => "fail" } }
        end
      end
    end
  end

  # DELETE /groups/1
  # DELETE /groups/1.json
  def destroy
    @group.destroy
    respond_to do |format|
      format.html { redirect_to groups_url, notice: "Group was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def get_data
    # binding.pry
    group = Group.where(id: params[:id])
    render :json => { group: group }
  end

  def update_data
    binding.pry
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_group
    @group = Group.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def group_params
    params.permit(:Name, :Status, :Description)
  end
end
