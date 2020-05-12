class TemplatesController < ApplicationController
  layout "system_layout"
  include TemplatesHelper
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_template
  FILE_CLEANUP_TIME_IN_SECONDS = 30

  def index
    @templates = Template.joins(:role, :admin_user).select('templates.*, roles.name as role_name, concat(admin_users.first_name," ",admin_users.last_name) as updated_by').order('updated_at desc')
  end

  def new
    role_ids = Template.pluck(:role_id)
    @roles = Role.where.not(id: role_ids)
    @competencies = Competency.all
    render "add", locals: { title: "Add a new template" }
  end

  def create
    @template = Template.new(template_params)
    @template.admin_user_id = current_admin_user.id if current_admin_user
    if @template.invalid?
      render json: { errors: @template.errors.messages }, status: 400
    elsif @template.save!
      render json: @template.id
    else
      render json: 'Failed'
    end
  end

  def edit
    role_ids = Template.pluck(:role_id)
    @template = Template.find(params[:id])
    current_role_id = Template.find_by_id(params[:id]).role_id
    @roles = Role.where(id: current_role_id).or(Role.where.not(id: role_ids))
    render "add", locals: { title: "Edit the template" }
  end

  def update
    @template = Template.find(params[:id])
    if @template.update_attributes(template_params)
      @template.update_attributes(admin_user_id: current_admin_user.id)
      render json: @template
    else
      render json: { errors: @template.errors }, status: 400
    end
  end

  def export_excel
    template_id = params["id"]
    ext = params["ext"]
    output_filename = export_excel_CDS_CDP(template_id, ext)

    # Delete the file after 30 seconds if the file is not replaced
    # Check every 1 seconds to see if the creation time still match,
    # If not, the file is overwritten and the thread is safe to exit
    # => Time Will change if the file is replaced (deleted then created).

    f = File.new("public/#{output_filename}")

    # get original creation time
    creation_time = f.ctime
    Thread.new do
      (0...(FILE_CLEANUP_TIME_IN_SECONDS)).each do |i|
        sleep 1
        f = File.new("public/#{output_filename}")
        new_creation_time = f.ctime
        if creation_time != new_creation_time
          # File has been modified, exit the thread
          # Later thread will clean it up
          Thread.exit
        end
      end

      f = File.new("public/#{output_filename}")
      new_creation_time = f.ctime
      File.delete("public/" + output_filename) if creation_time == new_creation_time
    end

    respond_to do |format|
      format.json { render :json => { :filename => output_filename } }
    end
  end

  def destroy
    @template = Template.find(params[:id])
    @template.destroy
    respond_to do |format|
      format.html { redirect_to action: 'index' }
      format.json { head :no_content }
    end
  end

  private

  def template_params
    if params.key?(:name) && params.key?(:role_id)
      params.permit(:name, :role_id, :description)
    end
  end

  def invalid_template
    logger.error "Attempt to access invalid template #{params[:id]}"
    redirect_to action: 'index', notice: 'Invalid template'
  end
end
