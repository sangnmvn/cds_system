# frozen_string_literal: true

class TemplatesController < ApplicationController
  layout "system_layout"
  before_action :get_privilege_id
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_template
  FILE_CLEANUP_TIME_IN_SECONDS = 10 * 60
  FULL_ACCESS_RIGHT = 9
  VIEW_ACCESS_RIGHT = 10
  include TemplatesHelper

  def index
    redirect_to index2_users_path unless @privilege_array.include?(FULL_ACCESS_RIGHT) || @privilege_array.include?(VIEW_ACCESS_RIGHT)
    @templates = Template.joins(:role, :user).select('templates.*, roles.name as role_name, concat(users.first_name," ",users.last_name) as updated_by').order("updated_at desc")
  end

  def new
    role_ids = Template.pluck(:role_id)
    @roles = Role.where.not(id: role_ids)
    @competencies = Competency.all
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
    unless @privilege_array.include?(FULL_ACCESS_RIGHT)
      redirect_to action: "index"
      return
    end
    role_ids = Template.pluck(:role_id)
    @template = Template.find(params[:id])
    @current_role_id = Template.find_by_id(params[:id]).role_id
    @roles = Role.where(id: @current_role_id).or(Role.where.not(id: role_ids))
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
    output_filename = export_excel_CDS_CDP(template_id, ext)

    # Delete the file after 30 seconds if the file is not replaced
    # Check every 1 seconds to see if the creation time still match,
    # If not, the file is overwritten and the thread is safe to exit
    # => Time Will change if the file is replaced (deleted then created).

    f = File.new("public/#{output_filename}")

    # get original creation time
    creation_time = f.ctime
    Thread.new do
      (0...FILE_CLEANUP_TIME_IN_SECONDS).each do |_i|
        sleep 1
        begin
          f = File.new("public/#{output_filename}")
          new_creation_time = f.ctime
          if creation_time != new_creation_time
            # File has been modified, exit the thread
            # Later thread will clean it up
            Thread.exit
          end
        rescue StandardError
          Thread.exit
        end
      end

      f = File.new("public/#{output_filename}")
      new_creation_time = f.ctime
      if creation_time == new_creation_time
        File.delete("public/" + output_filename)
      end
    end

    respond_to do |format|
      format.json { render json: { filename: output_filename } }
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

  def template_params
    params.permit(:name, :role_id, :description)
  end

  def invalid_template
    logger.error "Attempt to access invalid template #{params[:id]}"
    redirect_to action: "index"
  end
end
