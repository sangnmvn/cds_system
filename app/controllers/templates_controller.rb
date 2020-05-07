class TemplatesController < ApplicationController
  layout "system_layout"

  def index
    @roles = Role.all
    @competencies = Competency.all
  end

  def add
    @roles = Role.all
    @competencies = Competency.all
  end

  def load_slot
    @slots = Slot.where(competency_id: params[:id]).order(:level, :slot_id)
    render json: @slots
  end

  def add_new_slot
    @slot_id = Slot.where(competency_id: params[:competency_id], level: params[:level]).pluck(:slot_id).compact.max.to_i + 1 
    Slot.create(template_params(@slot_id))
    render json: "1" #repsonse success
  end

  def update_slot
    slot = Slot.find(params[:id])
    slot.update(template_params) if slot
    render json: "1" #repsonse success
  end

  def delete_slot
    Slot.destroy(params[:id])
    render json: "1"
  end

  def check_slot_in_template
    @competencies = Competency.where(template_id: params[:template_id]).pluck(:id)
  end

  private

  def template_params(slot_id = nil)
    param = {
      desc: params[:desc],
      evidence: params[:evidence],
      level: params[:level],
      competency_id: params[:competency_id],
    }
    param[:slot_id] = slot_id if slot_id
    param
  end
end
