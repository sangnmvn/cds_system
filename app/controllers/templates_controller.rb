# frozen_string_literal: true

class TemplatesController < ApplicationController
  layout "system_layout"
  before_action :get_privilege_id
  before_action :export_service
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_template
  FILE_CLEANUP_TIME_IN_SECONDS = 10 * 60
  FULL_ACCESS_RIGHT = 9
  VIEW_ACCESS_RIGHT = 10

  def index
    redirect_to root_path unless @privilege_array.include?(FULL_ACCESS_RIGHT) || @privilege_array.include?(VIEW_ACCESS_RIGHT)
    @templates = Template.joins(:role, :user).select('templates.*, roles.name as role_name, concat(users.first_name," ",users.last_name) as updated_by').order("updated_at desc")
    @is_full_assess = @privilege_array.include?(FULL_ACCESS_RIGHT)
  end

  def new
    role_ids = Template.pluck(:role_id)
    @roles = Role.where.not(id: role_ids)
    @competencies = Competency.all
    @is_full_assess = @privilege_array.include?(FULL_ACCESS_RIGHT)
    render "add", locals: { title: "Add a new Template" }
  end

  def create
    return render json: { status: "fail" } unless @privilege_array.include?(FULL_ACCESS_RIGHT)

    @template = Template.new(template_params)
    @template.user_id = current_user.id if current_user
    if @template.save
      render json: @template.id
    elsif @template.invalid?
      render json: { errors: @template.errors.messages }, status: 400
    else
      render json: "fail"
    end
  end

  def edit
    unless @privilege_array.include?(FULL_ACCESS_RIGHT) || @privilege_array.include?(VIEW_ACCESS_RIGHT)
      redirect_to action: "index"
      return
    end
    role_ids = Template.pluck(:role_id)
    @template = Template.find(params[:id])
    @current_role_id = Template.find_by_id(params[:id]).role_id
    @roles = Role.where(id: @current_role_id).or(Role.where.not(id: role_ids))
    @is_full_assess = @privilege_array.include?(FULL_ACCESS_RIGHT)
    render "add", locals: { title: "Edit the Template" }
  end

  def update
    return render json: { status: "fail" } unless @privilege_array.include?(FULL_ACCESS_RIGHT)
    @template = Template.find(params[:id])
    if @template.update_attributes(template_params)
      @template.update_attributes(user_id: current_user.id)
      render json: @template
    else
      render json: { errors: @template.errors }, status: 400
    end
  end

  def export_excel
    return render json: { status: "fail" } unless @privilege_array.include?(FULL_ACCESS_RIGHT) || @privilege_array.include?(VIEW_ACCESS_RIGHT)
    template_id = params["id"]
    ext = params["ext"]
    output_filename = @export_service.export_excel_CDS_CDP(template_id, ext)
    output_filename ||= ""
    @export_service.schedule_file_for_clean_up(output_filename)
    respond_to do |format|
      format.json { render json: { file_path: output_filename } }
    end
  end

  def destroy
    return render json: { status: "fail" } unless @privilege_array.include?(FULL_ACCESS_RIGHT)
    @template = Template.find(params[:id])
    @template.destroy
    respond_to do |format|
      format.html { redirect_to action: "index" }
      format.json { render json: { status: "success" } }
    end
  end

  private

  def export_service
    @export_service ||= Api::ExportService.new(template_params, current_user)
  end

  def template_params
    params.permit(:name, :role_id, :description, :status, :id, :ext)
  end

  def invalid_template
    logger.error "Attempt to access invalid template #{params[:id]}"
    redirect_to action: "index"
  end
end
