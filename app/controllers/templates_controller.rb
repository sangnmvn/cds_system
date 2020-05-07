class TemplatesController < ApplicationController
  layout "system_layout"

  def index
    @roles = Role.all
    @competencies = Competency.all
    @templates = Template.joins(:role, :admin_user).select("templates.*, roles.name as role_name, admin_users.email as updated_by")
  end

  def new
    name = params[:name]
    role = params[:role]
    description = params[:description]
    updated_by = current_admin_user.id
    @template = Template.new(name: name, role_id: role, desc: description, admin_user_id: updated_by)
    if @template.invalid?
      render json: {errors: @template.errors }, status: 400
    elsif @template.save!
      render json: @template.id
    else
      render json: "0"
    end
  end

  def add
    role_ids = Template.pluck(:role_id)
    @roles = Role.where.not(id: role_ids)
    @competencies = Competency.all
  end

  private
    def template_params
    end
end
