class GroupPrivilegesController < ApplicationController
  before_action :set_group_privilege, only: [:show, :edit, :update, :destroy]

  # GET /group_privileges
  # GET /group_privileges.json
  def index
    @group_privileges = GroupPrivilege.all
  end

  # GET /group_privileges/1
  # GET /group_privileges/1.json
  def show
  end

  # GET /group_privileges/new
  def new
    @group_privilege = GroupPrivilege.new
  end

  # GET /group_privileges/1/edit
  def edit
  end

  # POST /group_privileges
  # POST /group_privileges.json
  def create
    @group_privilege = GroupPrivilege.new(group_privilege_params)

    respond_to do |format|
      if @group_privilege.save
        format.html { redirect_to @group_privilege, notice: 'Group privilege was successfully created.' }
        format.json { render :show, status: :created, location: @group_privilege }
      else
        format.html { render :new }
        format.json { render json: @group_privilege.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /group_privileges/1
  # PATCH/PUT /group_privileges/1.json
  def update
    respond_to do |format|
      if @group_privilege.update(group_privilege_params)
        format.html { redirect_to @group_privilege, notice: 'Group privilege was successfully updated.' }
        format.json { render :show, status: :ok, location: @group_privilege }
      else
        format.html { render :edit }
        format.json { render json: @group_privilege.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /group_privileges/1
  # DELETE /group_privileges/1.json
  def destroy
    @group_privilege.destroy
    respond_to do |format|
      format.html { redirect_to group_privileges_url, notice: 'Group privilege was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_group_privilege
      @group_privilege = GroupPrivilege.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def group_privilege_params
      params.require(:group_privilege).permit(:reference)
    end
end
