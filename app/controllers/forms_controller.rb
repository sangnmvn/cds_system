class FormsController < ApplicationController
  before_action :form_service
  layout "system_layout"

  def create
    user_id = current_user.id
    form = Form.includes(:template).where(user_id: user_id, _type: "CDS").order(created_at: :desc).first
    @form_service.load_new_form if form.nil? || form.template.role_id != current_user.role_id

    @form_service.load_old_form(form)
  end

  def get_competencies
    # binding.pry
    render json: @form_service.get_competencies(form_params[:form_id])
  end

  def get_list_cds_assessment
    @form_service.get_list_cds_assessment(form_params[:user_ids])
  end

  def index
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    arr_id_slot = FormSlot.where(form_id: form_id).pluck(:slot_id)
    arr_id_competency = Slot.where("id in (?)", arr_id_slot).pluck(:competency_id).uniq
    # Competency.select(:id, :name).where(template_id: form_id)
    @competency = Competency.select(:id, :name, :_type).where("id in (?)", arr_id_competency)
    @arr = []
    
    @competency.each do |c|
      @arr << { name: c.name, type: c._type = c._type == "General" ? "G" : "S", level: convert_hash(c.id) }
    end
  end

  def preview_result
    @role_name = Role.find(current_user.role_id).name
    @first_name = current_user.first_name
    @last_name = current_user.last_name
    form_id = Form.where(user_id: current_user.id, _type: "CDS").pluck(:id).first
    @competency = Competency.select(:name).where(template_id: form_id)
  end

  def convert_hash(id)
    arr = Slot.where(competency_id: id).pluck(:level)
    hash = {}
    arr_uniq = arr.uniq
    arr_uniq.each { |x| hash[x] = arr.count x }
    hash
  end

  private

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def form_params
    params.permit(:form_id, :template_id, :competency_id, :user_ids)
  end
end
