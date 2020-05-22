class FormsController < ApplicationController
  def load_data_for_cds_assessment
    user_id = current_user.id
    Form.select(:id, :template_id).where(user_id: user_id, _type: :CDS)
      .order(created_at: :desc).first
  end

  def load_data_for_cdp_assessment
    user_id = current_user.id
    Form.select(:id, :template_id).where(user_id: user_id, _type: :CDS)
      .order(created_at: :desc).first
  end

  def create
    user_id = current_user.id
    form = Form.includes(:template).where(user_id: user_id, _type: "CDS").order(created_at: :desc).first

    load_new_form if form.nil? || form.template.role_id != current_user.role_id

    load_old_form(form)
  end


  private

  def form_params
  end
end
