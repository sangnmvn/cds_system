class UserGroupsController < ApplicationController
  layout "system_layout"
  # GET /user_groups
  # GET /user_groups.json
  def index
    @user_groups = UserGroup.all
    @user = AdminUser.all
  end
  def loadUser
    user_groups = UserGroup.where(:group_id => params[:id]).map{|user| user.admin_user_id}
    @list_user = AdminUser.all.select{|user| user unless user_groups.include? user.id }
    render json: @list_user
  end
  def loadGroup
    group = Group.find_by(id: params[:id])
    render json: group
  end
  def loadUserGroup
    @kq = UserGroup.includes(:group).includes(:admin_user).where(:group_id => params[:id])
    arr = Array.new
    @kq.each{|kq|
      hs = Hash.new
      hs[:id] = kq.id
      hs[:group_name] = kq.group.name
      hs[:admin_user_id] = kq.admin_user_id
      hs[:group_id] = kq.group_id
      hs[:first_name] = kq.admin_user.first_name
      hs[:last_name] = kq.admin_user.last_name
      hs[:email] = kq.admin_user.email
      arr << hs
    }
    render json: arr
  end
  def SaveUserGroup
    list_users = params[:list]
    id_group = params[:id]
    UserGroup.delete_by(group_id: id_group)
    list_users.each{ |user| UserGroup.create(group_id: id_group, admin_user_id: user)} if list_users.present? 
    render json: "1"
  end
  # GET /user_groups/1
  # GET /user_groups/1.json
  def show
  end

  # GET /user_groups/new
  def new
    @user_group = UserGroup.new
  end

  # GET /user_groups/1/edit
  def edit
  end

  # POST /user_groups
  # POST /user_groups.json
  def create
    @user_group = UserGroup.new(user_group_params)

    respond_to do |format|
      if @user_group.save
        format.html { redirect_to @user_group, notice: 'User group was successfully created.' }
        format.json { render :show, status: :created, location: @user_group }
      else
        format.html { render :new }
        format.json { render json: @user_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /user_groups/1
  # PATCH/PUT /user_groups/1.json
  def update
    respond_to do |format|
      if @user_group.update(user_group_params)
        format.html { redirect_to @user_group, notice: 'User group was successfully updated.' }
        format.json { render :show, status: :ok, location: @user_group }
      else
        format.html { render :edit }
        format.json { render json: @user_group.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /user_groups/1
  # DELETE /user_groups/1.json
  def destroy
    @user_group.destroy
    respond_to do |format|
      format.html { redirect_to user_groups_url, notice: 'User group was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_group
      @user_group = UserGroup.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_group_params
      params.fetch(:user_group, {})
    end
end
