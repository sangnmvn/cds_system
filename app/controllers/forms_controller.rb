class FormsController < ApplicationController
  before_action :form_service
  layout "system_layout"
  LEVEL_SLOTS = ["1A", "1B", "1C", "1D", "1E", "1F", "1G", "2A", "2B", "2C", "2D", "2E", "2F", "2G", "3A", "3B", "3C", "3D", "3E", "3F", "3G", "4A", "4B", "4C", "4D", "4E", "4F", "4G", "5A", "5B", "5C", "5D", "5E", "5F", "5G"]

  def index
  end

  def get_list_cds_assessment_manager
    render json: @form_service.get_list_cds_assessment_manager
  end

  def get_list_cds_assessment
    render json: @form_service.get_list_cds_assessment(current_user.id)
  end

  def get_competencies
    render json: @form_service.get_competencies(form_params[:form_id])
  end

  def cds_review
  end

  def cds_assessment
    schedules = Schedule.includes(:period).where(company_id: 1).where.not(status: "Done").order(:period_id)
    @period = schedules.map do |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    end
    params = form_params
    if params.include?(:form_id)
      form = Form.where(user_id: current_user.id, id: params[:form_id], _type: "CDS").first
      return if form.nil?
    else
      form = Form.includes(:template).where(user_id: current_user.id, _type: "CDS").order(created_at: :desc).first
    end
    @form_id = if form.nil? || form.template.role_id != current_user.role_id
        @form_service.create_form_slot
      else
        form.update(status: "New", period_id: nil) if form.status == "Done"
        form.id
      end
  end

  def get_cds_assessment
    render json: @form_service.format_data_slots
  end

  def save_cds_assessment_staff
    return render json: { status: "success" } if @form_service.save_cds_staff
    render json: { status: "fail" }
  end

  def save_cds_assessment_manager
    return render json: { status: "success" } if @form_service.save_cds_manager
    render json: { status: "fail" }
  end

  def preview_result
    form = Form.where(id: params[:form_id], user_id: current_user.id).first
    return "fail" if form.nil?

    @slots = LEVEL_SLOTS
    @competencies = Competency.where(template_id: form.template_id).pluck(:name)
    @result = @form_service.preview_result(form)
  end

  def destroy
    form = Form.find(params[:id])
    return render json: { status: "can't delete form" } if current_user.role_id == form.id
    if form.destroy
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def submit
    form = Form.find(params[:form_id])
    if form.update(period_id: params[:period_id], status: "Awaiting Review")
      #send mail if updated
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def approve
    status = @form_service.approve_cds
    render json: { status: status }
  end

  def get_cds_histories
    # binding.pry
    render json:  @form_service.get_data_view_history
  end

  private

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def form_params
    params.permit(:form_id, :template_id, :competency_id, :level, :user_id, :is_commit, :point, :evidence, :given_point, :recommend, :search, :filter, :slot_id, :period_id)
  end
end
