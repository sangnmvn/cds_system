class FormSlotsController < ApplicationController
  layout "system_layout"

  def index
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    arr_id_slot = FormSlot.where(form_id: form_id).pluck(:slot_id)
    arr_id_competency = Slot.where("id in (?)", arr_id_slot).pluck(:competency_id).uniq
    # Competency.select(:id, :name).where(template_id: form_id)
    @competency = Competency.select(:id, :name, :_type).where("id in (?)", arr_id_competency)
    @arr = []
    @competency.each do |c|
      binding.pry
      
      @arr << { name: c.name, type: c._type = c._type == "General" ? "G" : "S", level: Slot.where(competency_id: c.id).pluck(:level) }
    end
    binding.pry
  end

  def preview_result
    @role_name = Role.find(current_user.role_id).name
    @first_name = current_user.first_name
    @last_name = current_user.last_name
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    @competency = Competency.select(:name).where(template_id: form_id)
  end
end
