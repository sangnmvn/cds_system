class FormsController < ApplicationController
  before_action :form_service
  layout "system_layout"

  def cds_assessment
    user_id = current_user.id
    form = Form.includes(:template).where(user_id: user_id, _type: "CDS").order(created_at: :desc).first

    # @slots = if form.nil? || form.template.role_id != current_user.role_id
    #     @form_service.load_new_form
    #   else
    #     @form_service.load_old_form(form)
    #   end
    param = {
      competency_id: 1,
      form_id: 1,
    }
    @slots = Slot.joins(:form_slots).where(form_slots: { form_id: param[:form_id] }, competency_id: param[:competency_id]).order(:level, :slot_id)
    hash = {}
    arr_slots = []
    form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: param[:form_id], slot_id: @slots.pluck(:id))
    form_slots = @form_service.format_form_slot1(form_slots)
    @slots = @slots.map do |slot|
      if hash[slot.level].nil?
        hash[slot.level] = -1
      end
      hash[slot.level] += 1

      @form_service.slot_to_hash(slot, hash[slot.level], form_slots)
    end
  end

  # def format_data_slots(param = nil)

  # end

  def get_competencies
    render json: @form_service.get_competencies(form_params[:form_id])
  end

  def get_list_cds_assessment
    @form_service.get_list_cds_assessment(form_params[:user_ids])
  end

  def index
  end

  def preview_result
    @role_name = Role.find(current_user.role_id).name
    @first_name = current_user.first_name
    @last_name = current_user.last_name
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    @competency = Competency.select(:name).where(template_id: form_id)
  end

  private

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def form_params
    params.permit(:form_id, :template_id, :competency_id, :user_ids)
  end
end
