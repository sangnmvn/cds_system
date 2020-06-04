class FormsController < ApplicationController
  layout "system_layout"
  before_action :form_service
  before_action :get_privilege_id
  LEVEL_SLOTS = []
  REVIEW_CDS = 16
  APPROVE_CDS = 17

  def index
  end

  def get_list_cds_assessment_manager
    data = if @privilege_array.include?(APPROVE_CDS)
        @form_service.get_list_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.get_list_cds_review
      end
    render json: data
  end

  def get_list_cds_assessment
    render json: @form_service.get_list_cds_assessment(current_user.id)
  end

  def get_competencies
    render json: @form_service.get_competencies(form_params[:form_id])
  end

  def cds_review
    @companies = Company.all
    @data_filter = if @privilege_array.include?(APPROVE_CDS)
        @form_service.data_filter_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.data_filter_cds_review
      end
  end

  def cds_assessment
    params = form_params
    @hash = {}
    schedules = Schedule.includes(:period).where(company_id: current_user.company_id).where.not(status: "Done").order(:period_id)
    @period = schedules.map do |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    end
    if params[:title_history_id].present?
      @hash[:status] = "Done"
      @hash[:title_history_id] = params[:title_history_id]
      @hash[:title] = "CDS Assessment for " + TitleHistory.find(params[:title_history_id]).period.format_name
      return @hash
    end
    if params.include?(:form_id)
      form = Form.where(user_id: current_user.id, id: params[:form_id], _type: "CDS").first
      return if form.nil?
    else
      template_id = Template.find_by(role_id: current_user.role_id, status: true)&.id
      return if template_id.nil?
      form = Form.includes(:template).where(user_id: current_user.id, _type: "CDS").order(created_at: :desc).first
    end
    if form.nil? || form.template.role_id != current_user.role_id
      form = @form_service.create_form_slot
    else
      form.update(status: "New", period_id: nil, is_delete: false) if form.status == "Done"
    end
    @hash[:form_id] = form.id
    @hash[:status] = form.status
    @hash[:title] = form.period&.format_name.present? ? "CDS Assessment for " + form.period&.format_name : "New CDS Assessment"
  end

  def cds_cdp_review
    # binding.pry
    return if params[:user_id].nil?
    form = Form.where(id: params[:form_id]).first
    user = User.includes(:role).find(params[:user_id])
    @hash = {}
    @hash[:user_id] = params[:user_id]
    @hash[:form_id] = form.id
    @hash[:status] = form.status
    @hash[:title] = "CDS Review for " + user.role.name + "-" + user.format_name
  end

  def get_cds_assessment
    render json: @form_service.format_data_slots
  end

  def get_slot_is_change
    render json: @form_service.get_slot_change
  end

  def save_cds_assessment_staff
    return render json: { status: "success" } if @form_service.save_cds_staff
    render json: { status: "fail" }
  end

  def save_add_more_evidence
    return render json: { status: "success" } if @form_service.save_add_more_evidence
    render json: { status: "fail" }
  end

  def save_cds_assessment_manager
    return render json: { status: "success" } if @form_service.save_cds_manager
    render json: { status: "fail" }
  end

  def get_data_filter_cds_assessment_manager
    render json: @form_service.data_filter_cds_assessment_manager
  end

  def get_data_slot
    return render json: @form_service.get_data_form_slot
  end

  def preview_result
    form = Form.find_by(_type: "CDS", user_id: current_user.id)
    return "fail" if form.nil?

    @slots = LEVEL_SLOTS
    @competencies = Competency.where(template_id: form.template_id).pluck(:name)
    @result = @form_service.preview_result(form)
  end

  def destroy
    form = Form.find(params[:id])
    return render json: { status: "can't delete form" } if current_user.role_id == form.role_id || form.status != "New"
    if form.update(is_delete: true)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def submit
    form = Form.find(params[:form_id])
    if form.update(period_id: params[:period_id], status: "Awaiting Review")
      approvers = Approver.where(user_id: form.user_id).includes(:approver)
      user = form.user
      period = form.period
      CdsAssessmentMailer.with(user: user, from_date: period.from_date, to_date: period.to_date, reviewer: approvers.to_a).user_submit.deliver_now
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def reviewer_submit
    approver = Approver.where(user_id: params[:user_id], approver_id: current_user.id)
    if approver.update(is_submit_cds: true)
      approvers = Approver.where(user_id: params[:user_id]).includes(:approver)
      if approvers.where(is_submit_cds: false).count.zero?
        return render json: { status: "fail" } unless Form.find(params[:form_id]).update(status: "Awaiting Approval")
      end
      user = User.find(params[:user_id])
      # mail submit
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def approve_cds
    status = @form_service.approve_cds
    render json: { status: status }
  end

  def get_cds_histories
    render json: @form_service.get_data_view_history
  end

  def review_cds_assessment
    params = form_params
    @hash = {}
    schedules = Schedule.includes(:period).where(company_id: 1).where.not(status: "Done").order(:period_id)
    @period = schedules.map do |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    end
    return title_history_id = params[:title_history_id] if params[:title_history_id].present?
    if params.include?(:form_id)
      form = Form.where(user_id: current_user.id, id: params[:form_id], _type: "CDS").first
      return if form.nil?
    else
      form = Form.includes(:template).where(user_id: current_user.id, _type: "CDS").order(created_at: :desc).first
    end
    @hash[:title_history_id] = title_history_id
    form_id = if form.nil? || form.template.role_id != current_user.role_id
        @form_service.create_form_slot
      else
        form.update(status: "New", period_id: nil) if form.status == "Done"
        form.id
      end
    @hash[:form_id] = form_id
    @hash[:status] = form.status
  end

  def re_assess_slot
  end

  private

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def form_params
    params[:offset] = params[:iDisplayStart] || 0
    params[:user_ids] = params[:user_ids] || 0
    params[:company_ids] = params[:company_ids] || "3"
    params[:project_ids] = params[:project_ids] || "1"
    params[:period_ids] = params[:period_ids] || "50"
    params[:role_ids] = params[:role_ids] || "1"

    params.permit(:form_id, :template_id, :competency_id, :level, :user_id, :is_commit, :point, :evidence, :given_point, :recommend, :search, :filter, :slot_id, :period_id, :title_history_id, :form_slot_id, :competance_name, :offset, :user_ids, :company_ids, :project_ids, [:period_ids], :role_ids)
  end
end
