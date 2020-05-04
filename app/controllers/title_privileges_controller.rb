class TitlePrivilegesController < ApplicationController
  before_action :set_title_privilege, only: [:show, :edit, :update, :destroy]

  # GET /title_privileges
  # GET /title_privileges.json
  def index
    @title_privileges = TitlePrivilege.all
  end

  # GET /title_privileges/1
  # GET /title_privileges/1.json
  def show
  end

  # GET /title_privileges/new
  def new
    @title_privilege = TitlePrivilege.new
  end

  # GET /title_privileges/1/edit
  def edit
  end

  # POST /title_privileges
  # POST /title_privileges.json
  def create
    @title_privilege = TitlePrivilege.new(title_privilege_params)

    respond_to do |format|
      if @title_privilege.save
        format.html { redirect_to @title_privilege, notice: 'Title privilege was successfully created.' }
        format.json { render :show, status: :created, location: @title_privilege }
      else
        format.html { render :new }
        format.json { render json: @title_privilege.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /title_privileges/1
  # PATCH/PUT /title_privileges/1.json
  def update
    respond_to do |format|
      if @title_privilege.update(title_privilege_params)
        format.html { redirect_to @title_privilege, notice: 'Title privilege was successfully updated.' }
        format.json { render :show, status: :ok, location: @title_privilege }
      else
        format.html { render :edit }
        format.json { render json: @title_privilege.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /title_privileges/1
  # DELETE /title_privileges/1.json
  def destroy
    @title_privilege.destroy
    respond_to do |format|
      format.html { redirect_to title_privileges_url, notice: 'Title privilege was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_title_privilege
      @title_privilege = TitlePrivilege.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def title_privilege_params
      params.require(:title_privilege).permit(:Name)
    end
end
