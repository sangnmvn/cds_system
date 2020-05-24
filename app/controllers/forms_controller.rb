class FormsController < ApplicationController
  before_action :form_service

  def create
    user_id = current_user.id
    form = Form.includes(:template).where(user_id: user_id, _type: "CDS").order(created_at: :desc).first
    @form_service.load_new_form if form.nil? || form.template.role_id != current_user.role_id

    @form_service.load_old_form(form)
  end

  def get_competenies
    @form_service.get_competencies(form_params[:template_id])
  end

  def get_list_cds_assessment
    @form_service.get_list_cds_assessment(form_params[:user_ids])
  end

  private

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def form_params
    params.permit(:form_id, :template_id, :competency_id, :user_ids)
  end
end
