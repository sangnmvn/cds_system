class FormSlotsController < ApplicationController
  layout "system_layout"

  def index
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    arr_id_slot = FormSlot.where(form_id: form_id).pluck(:slot_id)
    arr_id_competency = Slot.where("id in (?)", arr_id_slot).pluck(:competency_id).uniq
    # Competency.select(:id, :name).where(template_id: form_id)

    @competency = Competency.select(:id, :name, :_type).where("id in (?)", arr_id_competency)
    @competency.each do |c|
      c._type = c._type == "General" ? "G" : "S"
    end
    # binding.pry
  end
end
