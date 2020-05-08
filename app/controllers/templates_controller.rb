class TemplatesController < ApplicationController
  layout "system_layout"

  def index
    @roles = Role.all
    @competencies = Competency.where(template_id: 1)
    @templates = Template.joins(:role, :admin_user).select("templates.*, roles.name as role_name, admin_users.email as updated_by")
  end

  def new
    @template = Template.new(template_params)
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
    def template_params()
      param = {
        name: params[:name],
        role_id: params[:role],
        desc: params[:description],
        admin_user_id: current_admin_user.id
      }
    end
end
