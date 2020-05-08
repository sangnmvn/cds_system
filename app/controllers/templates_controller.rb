class TemplatesController < ApplicationController
  layout "system_layout"

  def index
    @roles = Role.all
    @competencies = Competency.all
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

  def load_slot
    search = params[:search]
    if search
      @slots = Slot.where(competency_id: params[:id]).ransack(desc_cont: search).result
    else
      @slots = Slot.where(competency_id: params[:id]).order(:level, :slot_id)
    end
    render json: @slots
  end

  def new_slot
    @slot_id = Slot.where(competency_id: params[:competency_id], level: params[:level]).pluck(:slot_id).compact.max.to_i + 1
    @slot = Slot.new(slot_params(@slot_id))
    render json: {errors: @slot.errors }, status: 400 if @slot.invalid?
    render json: @slot.id if @slot.save!
  end

  def update_slot
    slot = Slot.find(params[:id])
    slot.update(slot_params) if slot
    render json: "1" #repsonse success
  end

  def delete_slot
    Slot.destroy(params[:id])
    render json: "1"
  end

  def check_slot_in_template
    @competencies = Competency.where(template_id: params[:template_id]).pluck(:id)
    @competencies.each { |competency|
      slots = Slot.find_by(competency_id: competency)
      if slots.blank?
        render json: "-1"
        return
      end
    }
    render json: "1"
  end

  def update_status_template
    template = Template.find(params[:template_id])
    template.update(status: 1)
  end

  private

  def slot_params(slot_id = nil)
    param = {
      desc: params[:desc],
      evidence: params[:evidence],
      level: params[:level],
      competency_id: params[:competency_id],
    }
    param[:slot_id] = slot_id if slot_id
    param
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
