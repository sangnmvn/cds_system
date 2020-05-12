class TemplatesController < ApplicationController
  layout "system_layout"
  include TemplatesHelper
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_template
  helper_method :sort_column, :sort_direction
  FILE_CLEANUP_TIME_IN_SECONDS = 30

  def index
    @roles = Role.all
    @competencies = Competency.all
    @templates = Template.joins(:role, :admin_user).select("templates.*, roles.name as role_name, admin_users.email as updated_by").order(sort_column + " " + sort_direction)
  end

  def new
    template = Template.new(template_params)
    template.admin_user_id = current_admin_user.id if current_admin_user
    if template.invalid?
      render json: { errors: template.errors }, status: 400
    elsif template.save!
      render json: template.id
    else
      render json: "Failed"
    end
  end

  def edit
    #Check view Edit or Action Edit
    if params[:type] == "Edit"
      template = Template.find(params[:id])
      if template.update_attributes(template_params)
        template.update_attributes(admin_user_id: current_admin_user.id)
        render json: template_params
      else
        render json: { errors: template.errors }, status: 400
      end
    else
      redirect_to add_templates_path(id: params[:id])
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

  def add
    #Add
    role_ids = Template.pluck(:role_id)
    @roles = Role.where.not(id: role_ids)
    @competencies = Competency.all

    #Edit
    if params[:id]
      @template_edit = Template.find(params[:id])
      current_role_id = Template.find_by_id(params[:id]).role_id
      @roles_edit = Role.where(id: current_role_id).or(Role.where.not(id: role_ids))
    end
  end

  def delete
    @template = Template.find(params[:id])
    @template.destroy
    respond_to do |format|
      format.html { redirect_to action: "index" }
      format.json { head :no_content }
    end
  end

  private

  def template_params
    params.permit(:name, :role_id, :description) if params.has_key?(:name) && params.has_key?(:role_id) && params.has_key?(:description)
  end

  def invalid_template
    logger.error "Attempt to access invalid template #{params[:id]}"
    redirect_to action: "index", notice: "Invalid template"
  end

  def sort_column
    Template.column_names.include?(params[:sort]) ? params[:sort] : "name"
  end

  def sort_direction
    %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
  end
end
