class FormsController < ApplicationController
  layout "system_layout"
  before_action :form_service
  before_action :get_privilege_id
  REVIEW_CDS = 16
  APPROVE_CDS = 17
  include TitleMappingsHelper

  def index
    @check_6_month = true
    @check_6_month = current_user.joined_date.to_i < 6.months.ago.to_i if current_user.joined_date
  end

  def index_cds_cdp
    @check_6_month = true
    @check_6_month = current_user.joined_date.to_i < 6.months.ago.to_i if current_user.joined_date
  end

  def get_list_cds_assessment_manager
    data = if @privilege_array.include?(APPROVE_CDS)
        @form_service.get_list_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.get_list_cds_review
      else
        redirect_to root_path
      end
    render json: data
  end

  def get_list_cds_assessment
    render json: @form_service.get_list_cds_assessment(current_user.id)
  end

  def get_competencies
    render json: @form_service.get_competencies(form_params[:form_id])
  end

  def get_competencies_reviewer
    render json: @form_service.get_competencies_reviewer(form_params[:form_id])
  end

  def cds_review
    @companies = Company.all
    @data_filter = if @privilege_array.include?(APPROVE_CDS)
        @form_service.data_filter_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.data_filter_cds_review
      else
        redirect_to root_path
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
      @hash[:title] = "CDS Assessment for " + TitleHistory.find_by_id(params[:title_history_id]).period.format_name
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

  def cdp_assessment
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
      @hash[:title] = "CDS Assessment for " + TitleHistory.find_by_id(params[:title_history_id]).period.format_name
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
    return if params[:user_id].nil?
    schedules = Schedule.includes(:period).where(company_id: current_user.company_id).where.not(status: "Done").order(:period_id)

    @is_reviewer = false
    @is_approver = false
    reviewers = Approver.find_by(user_id: params[:user_id], approver_id: current_user.id)
    @is_reviewer = true if reviewers.present?

    user_id = Form.where(id: params[:form_id]).pluck(:user_id)
    project_ids = ProjectMember.where(user_id: user_id).pluck(:project_id)
    user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
    user_groups = UserGroup.where(user_id: user_ids, group_id: 37).includes(:user).where("users.id": current_user.id).first
    if user_groups.present?
      @is_reviewer = false
      @is_approver = true
    end
    @period = schedules.map do |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    end

    form = Form.where(id: params[:form_id]).first
    user = User.includes(:role).find_by_id(params[:user_id])
    is_submit = Approver.find_by(approver_id: current_user.id, user_id: params[:user_id])&.is_submit_cds
    @hash = {
      user_id: params[:user_id],
      user_name: user.format_name,
      form_id: form.id,
      status: form.status,
      title: "CDS Review for " + user.role.name + "-" + user.format_name,
      is_submit: is_submit,
      is_approval: @privilege_array.include?(APPROVE_CDS),
    }
  end

  def get_assessment_staff
    render json: @form_service.get_assessment_staff
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

  def request_add_more_evidence
    data = @form_service.request_add_more_evidence
    return render json: { status: "success", color: data } if data.present?
    render json: { status: "fail" }
  end

  def save_cds_assessment_manager
    return render json: { status: "success" } if @form_service.save_cds_manager
    render json: { status: "fail" }
  end

  def get_data_slot
    return render json: @form_service.get_data_form_slot
  end

  def preview_result
    return redirect_to forms_path if params[:form_id].nil?

    form = Form.includes(:title).find_by_id(params[:form_id])
    return redirect_to forms_path if form.nil? || form.user_id != current_user.id && (@privilege_array & [APPROVE_CDS, REVIEW_CDS]).any?

    @competencies = Competency.where(template_id: form.template_id).select(:name, :id)
    @result = @form_service.preview_result(form)
    @calculate_result = @form_service.calculate_result(form, @competencies, @result)
    @slots = @result.values.map(&:keys).flatten.uniq.sort

    # slot_ids = @result.values.map(&:keys).flatten.uniq.sort
    # check = 1
    # count = 0
    # @slots = []
    # slot_ids.each do |s|
    #   if check != s.to_i
    #     @slots << (check.to_s + LETTER_CAP[count])
    #     count = 1
    #   end
    #   @slots << s
    #   check = s.to_i
    #   count += 1
    # end
  end

  def destroy
    form = Form.find_by_id(params[:id])
    return render json: { status: "can't delete form" } if current_user.role_id == form.role_id || form.status != "New"
    if form.update(is_delete: true)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def submit
    form = Form.find_by_id(params[:form_id])
    approvers = Approver.where(user_id: form.user_id).includes(:approver)
    return render json: { status: "fail" } if approvers.empty?

    if form.update(period_id: params[:period_id], status: "Awaiting Review", submit_date: DateTime.now)
      user = form.user
      period = form.period
      CdsAssessmentMailer.with(user: user, from_date: period.from_date, to_date: period.to_date, reviewer: approvers.to_a).user_submit.deliver_later(wait: 1.minute)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def reviewer_submit
    approver = Approver.where(user_id: params[:user_id], approver_id: current_user.id)
    project_ids = ProjectMember.where(user_id: params[:user_id]).pluck(:project_id)
    user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
    user_groups = UserGroup.where(user_id: user_ids, group_id: 37).includes(:user)
    if approver.update(is_submit_cds: true)
      approvers = Approver.where(user_id: params[:user_id]).includes(:approver)
      user = User.find_by_id(params[:user_id])
      if approvers.where(is_submit_cds: false).where.not(approver_id: user_groups.pluck(:user_id)).count.zero?
        return render json: { status: "fail" } unless Form.find_by_id(params[:form_id]).update(status: "Awaiting Approval")
        user_groups.each do |user_group|
          CdsAssessmentMailer.with(staff: user, pm: user_group.user).email_to_pm.deliver_later(wait: 1.minute)
        end
      end
      render json: { status: "success", user_name: user.format_name }
    else
      render json: { status: "fail" }
    end
  end

  def approve_cds
    user_name = User.find_by_id(params[:user_id]).format_name
    status = @form_service.approve_cds
    render json: { status: status, user_name: user_name }
  end

  def reject_cds
    status = @form_service.reject_cds
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

  def get_filter
    data = if @privilege_array.include?(APPROVE_CDS)
        @form_service.data_filter_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.data_filter_cds_review
      else
        redirect_to root_path
      end
    render json: data
  end

  private

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def form_params
    params[:offset] = params[:iDisplayStart] || "0"
    params[:user_ids] = params[:user_ids] || "0"
    params[:company_ids] = params[:company_ids] || "0"
    params[:project_ids] = params[:project_ids] || "0"
    params[:period_ids] = params[:period_ids] || "50"
    params[:role_ids] = params[:role_ids] || "0"

    params.permit(:form_id, :template_id, :competency_id, :level, :user_id, :is_commit,
                  :point, :evidence, :given_point, :recommend, :search, :filter, :slot_id,
                  :period_id, :title_history_id, :form_slot_id, :competency_name, :offset,
                  :user_ids, :company_ids, :project_ids, :period_ids, :role_ids, :type)
  end
end
