class FormSlotsController < ApplicationController
  def index
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    # arr_id_slot = FormSlot.where(form_id: form_id).pluck(:slot_id)
    # Slot.where('id in (?)',arr_id_slot).pluck(:competency_id).uniq
    Competency.select(:id, :name).where(template_id: form_id)
  end
end
