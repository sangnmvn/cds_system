class FormsController < ApplicationController
  include TitleMappingsHelper
  layout "system_layout"
  before_action :form_service
  before_action :export_service
  before_action :get_privilege_id
  before_action :check_privilege
  VIEW_CDS_CDP_ASSESSMENT = 15
  REVIEW_CDS = 16
  APPROVE_CDS = 17
  FULL_ACCESS = 24
  FULL_ACCESS_MY_COMPANY = 27
  HIGH_FULL_ACCESS = 26

  def index_cds_cdp
    form = Form.find_by(user_id: current_user.id, is_delete: false)
    periods = Schedule.includes(:period).where(company_id: current_user.company_id, period_id: form&.period_id, _type: "HR")
                                        .where.not(status: "Done")
    @check_status = form.nil? || (form&.status == "Done" && periods.blank?)
  end

  def get_list_cds_assessment_manager
    data = if (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY, APPROVE_CDS, REVIEW_CDS, HIGH_FULL_ACCESS]).any?
        @form_service.get_list_cds_review
      else
        redirect_to root_path
      end
    render json: data
  end

  def get_summary_comment
    render json: @form_service.get_summary_comment
  end

  def get_line_manager_miss_list
    render json: @form_service.get_line_manager_miss_list
  end

  def save_summary_comment
    render json: @form_service.save_summary_comment
  end

  def cancel_request
    form_slot_ids = params[:form_slot_id].map(&:to_i)
    data = @form_service.cancel_request(form_slot_ids, params[:slot_id])
    render json: { status: data }
  end

  def export_excel_cds_review
    file_path = ""
    if (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY, APPROVE_CDS, REVIEW_CDS, HIGH_FULL_ACCESS]).any?
      data = @form_service.get_list_cds_review_to_export
    end
    file_path = @export_service.export_excel_cds_review(data)
    render json: { file_path: file_path }
  end

  def get_list_cds_assessment
    render json: @form_service.get_list_cds_assessment(current_user.id)
  end

  def get_competencies
    render json: @form_service.get_competencies(form_params[:form_id])
  end

  def get_period_table_header
    if params[:period_ids].count == 1 && params[:company_ids].count == 1 && params[:company_ids] != ["0"]
      schedule = Schedule.includes(:period).where(company_id: params[:company_ids], "periods.id": params[:period_ids]).order("periods.to_date ASC").last    
      period_prev = Schedule.includes(:period).where(company_id: params[:company_ids]).where("periods.to_date<?", schedule.period&.to_date).order("periods.to_date ASC").last&.period&.format_name
      period = schedule.period&.format_name
      return render json: {period_prev: period_prev, period: period}
    else
      return render json: {period_prev: "", period: ""}
    end
  end

  def cds_review
    @companies = Company.all
    @data_filter = if @privilege_array.include?(FULL_ACCESS)
        @form_service.data_filter_cds_view_others
      elsif @privilege_array.include?(FULL_ACCESS_MY_COMPANY)
        @form_service.data_filter_cds_view_others(current_user.company_id)
      elsif (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?
        @form_service.data_filter_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.data_filter_cds_review
      else
        redirect_to root_path
      end
  end

  def cdp_assessment
    @check_5_month = true
    @check_5_month = current_user.joined_date.to_i < 5.months.ago.to_i if current_user.joined_date
    params = form_params
    user = if params[:form_id].present?
        Form.includes(:user).find_by_id(params[:form_id])&.user
      elsif params[:title_history_id].present?
        @title_history_id = params[:title_history_id]
        TitleHistory.find_by_id(params[:title_history_id])&.user
      else
        current_user
      end
    return redirect_to index_cds_cdp_forms_path if user.nil?
    @user = {
      format_name: user.format_name,
      account: user.account,
      role_name: user.role&.name || "",
    }
    @hash = {}
    schedules = Schedule.includes(:period).where(company_id: current_user.company_id, status: "In-progress").order("periods.to_date")

    @period = schedules.map { |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    }.uniq
    #@period = schedules.map do |schedule|
     # {
      #  id: schedule.period_id,
       # name: schedule.period.format_name,
      #}
    #end
    if params[:title_history_id].present?
      title_history = TitleHistory.find_by_id(params[:title_history_id])
      return redirect_to index_cds_cdp_forms_path if title_history.nil?
      @hash[:is_submit_late] = false
      @hash[:status] = "Done"
      @hash[:title_history_id] = title_history.id
      @hash[:title] = "CDS/CDP Assessment for " + TitleHistory.find_by_id(params[:title_history_id]).period.format_name
      @hash[:form_id] = Form.includes(:template).where(user_id: current_user.id).order(created_at: :desc).first&.id
      return @hash
    end
    if params.include?(:form_id)
      form = Form.where(user_id: current_user.id, id: params[:form_id]).first
      return if form.nil?
    else
      template_id = Template.find_by(role_id: current_user.role_id, status: true)&.id
      return if template_id.nil?
      form = Form.includes(:template).where(user_id: current_user.id).order(created_at: :desc).first
    end
    if form.nil? || form.template.role_id != current_user.role_id
      form = @form_service.create_form_slot
    else
      form.update(status: "New", period_id: nil, is_delete: false) if form.status == "Done"
      form_slot = FormSlot.where(form_id: form.id)

      role_id = current_user.role_id
      template_id = Template.find_by(role_id: role_id, status: true)&.id
      competency_ids = Competency.where(template_id: template_id).order(:location).pluck(:id)
      slot_ids = Slot.where(competency_id: competency_ids).order(:level, :slot_id).pluck(:id)

      @form_service.create_form_slot(form) if form_slot.empty? || slot_ids.count > form_slot.count
      form.update(is_delete: false) unless form.nil?
    end
    h_slots = FormSlot.joins(:comments).where(form_id: form.id, comments: { re_update: true })
    @hash[:is_disable_confirm_update] = h_slots.present?
    @hash[:is_submit_late] = form.is_submit_late
    @hash[:resubmit] = form.period&.status.present? && form.period.status.eql?("In-progress")
    @hash[:form_id] = form.id
    @hash[:status] = form.status
    @hash[:title] = form.period&.format_name.present? ? "CDS/CDP Assessment for " + form.period&.format_name : "New CDS/CDP Assessment"
  end

  def request_update_cds
    form_slot_ids = params[:form_slot_id].map(&:to_i)
    data = @form_service.request_update_cds(form_slot_ids, params[:slot_id])
    render json: { status: data }
  end

  def cds_cdp_review
    return redirect_to root_path unless (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY, APPROVE_CDS, REVIEW_CDS, HIGH_FULL_ACCESS]).any?
    return if params[:user_id].nil?

    form = Form.find_by_id(params[:form_id])
    @form_id = params[:form_id]
    @user_id = params[:user_id]
    return redirect_to root_path if form.nil?
    return redirect_to root_path if !(@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any? && Approver.where(user_id: params[:user_id], approver_id: current_user.id, period_id: form.period_id).blank? && params[:user_id] != current_user.id
    @status = form.status || ""
    schedules = Schedule.includes(:period).where(company_id: current_user.company_id).where.not(status: "Done").order("periods.to_date")
    @period = schedules.map do |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    end

    user = User.includes(:role).find_by_id(params[:user_id])
    approver = Approver.find_by(approver_id: current_user.id, user_id: params[:user_id], period_id: form.period_id)

    form_slot = FormSlot.joins(:comments).where(form_id: form.id)
    h_slots =  form_slot.where(comments: { re_update: true })
    @hash = {
      user_id: params[:user_id],
      user_name: user.format_name,
      user_account: user.account,
      form_id: form.id,
      status: (!approver&.is_approver && approver&.is_submit_cds) ? "Submited" : form.status,
      title: "CDS/CDP of #{user.role.name} - #{user.account}",
      is_submit: approver&.is_submit_cds || false,
      is_approver: approver&.is_approver || false,
      is_reviewer: !approver&.is_approver || false,
      is_hr: approver.nil? || false,
      is_submit_late: form.is_submit_late,
      is_disable_confirm_update: h_slots.present?,
      is_flag_yellow: form_slot.where(comments: { flag: "yellow" }).count >= 1,
    }
  end

  def get_assessment_staff
    form = Form.find_by_id(params[:form_id])
    form_slot = FormSlot.includes(:comments).where(id: params[:form_slot_id]).first
    comment = form_slot.comments.where(comments: {is_delete: false}).first if form_slot&.comments.present?
    is_approver = Approver.where(user_id: form.user_id, approver_id: current_user.id, period_id: form.period_id).present?
    return render json: { status: "fail_devtools" } if ((is_approver || (form_slot&.is_passed == 1 && !form_slot.is_change) || ((form.status == "Awaiting Review" || form.status == "Awaiting Approval") && comment&.flag != "orange" && comment&.flag != "yellow")) || form.status == "Done" || form.user_id != current_user.id)
    render json: @form_service.get_assessment_staff
  end

  def get_cds_assessment
    render json: @form_service.format_data_slots
  end

  def get_slot_is_change
    render json: @form_service.get_slot_change
  end

  def get_is_requested
    render json: { status: @form_service.get_is_requested }
  end

  def confirm_request
    return render json: { status: "success" } if @form_service.confirm_request
    render json: { status: "fail" }
  end

  def save_cds_assessment_staff
    form = Form.find_by_id(params[:form_id])
    form_slot = FormSlot.includes(:comments).where(form_id: params[:form_id], slot_id: params[:slot_id], comments: {is_delete: false}).first
    is_approver = Approver.where(user_id: form.user_id, approver_id: current_user.id, period_id: form.period_id).present?
    return render json: { status: "fail_devtools" } if ((is_approver || (form_slot&.is_passed == 1 && !form_slot&.is_change) || ((form.status == "Awaiting Review" || form.status == "Awaiting Approval") && form_slot&.comments&.first&.flag != "orange" && form_slot&.comments&.first&.flag != "yellow")) || form.status == "Done" || form.user_id != current_user.id)
    data = @form_service.save_cds_staff
    return render json: { status: "success", data: data } if data.present?
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
    form = Form.find_by_id(params[:form_id])
    form_slot = FormSlot.includes(:comments).where(form_id: params[:form_id], slot_id: params[:slot_id], comments: {is_delete: false}).first
    approver = Approver.where(user_id: form.user_id, approver_id: current_user.id, period_id: form.period_id).first
    return render json: { status: "fail_devtools" } if (approver.nil? || (approver&.is_submit_cds && form_slot.comments&.first&.flag != "orange" && form_slot.comments&.first&.flag != "yellow") || form.status == "Done")
    return render json: { status: "success" } if @form_service.save_cds_manager
    render json: { status: "fail" }
  end

  def check_status_form
    form = Form.find_by(id: params[:form_id])
    if (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY, APPROVE_CDS, REVIEW_CDS, HIGH_FULL_ACCESS]).any? && current_user.id != form.user_id
      h_result = @form_service.get_line_manager_miss_list
    end

    return render json: { data: h_result, status: form.status } if form.present?
    render json: { status: "fail" }
  end

  def get_data_slot
    return render json: @form_service.get_data_form_slot
  end

  def get_conflict_assessment
    return render json: @form_service.get_conflict_assessment
  end

  def preview_result
    return if params[:form_id].nil?
    form = Form.includes(:title).find_by_id(params[:form_id])

    @form_id = form.id
    @competencies = Competency.where(template_id: form.template_id).select(:name, :id)
    @result = @form_service.preview_result(form)
    user = User.includes(:role).find_by_id(form.user_id)
    return redirect_to root_path if !(@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any? && Approver.where(user_id: user.id, approver_id: current_user.id, period_id: form.period_id).blank? && user.id != current_user.id
    @form_service.get_location_slot(@competencies.pluck(:id))
    @title = "View CDS/CDP Result For #{user.role.name} - #{user.format_name}"

    @slots = @form_service.get_location_slot(@competencies.pluck(:id)).values.flatten.uniq.sort

    schedules = Schedule.includes(:period).where(company_id: current_user.company_id, status: "In-progress").order("periods.to_date")
    @period = schedules.map { |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    }.uniq
    approver = Approver.find_by(approver_id: current_user.id, user_id: user.id, period_id: form.period_id)
    @hash = {
      user_id: user.id,
      user_name: user.format_name,
      # user_account: user.account,
      # form_id: form.id,
      status: (!approver&.is_approver && approver&.is_submit_cds) ? "Submited" : form.status,
      # title: "CDS/CDP of #{user.role.name} - #{user.account}",
      is_submit: approver&.is_submit_cds || false,
      is_approver: approver&.is_approver || false,
      is_reviewer: (!approver&.is_approver && !approver.nil?) || false,
      is_hr: approver.nil? || false,
      is_submit_late: form.is_submit_late,
      # is_disable_confirm_update: h_slots.present?,
      # is_flag_yellow: form_slot.where(comments: { flag: "yellow" }).count >= 1,
      is_staff: approver.nil? && (current_user.id == user.id) || false,
      resubmit: form.period&.status.present? && form.period.status.eql?("In-progress")
    }
  end

  def suggest_cds_cdp
    return if params[:form_id].nil?
    form = Form.includes(:title).find_by_id(params[:form_id])

    @form_id = form.id
    @competencies = Competency.where(template_id: form.template_id).select(:name, :id)
    @result = @form_service.preview_result(form)
    user = User.includes(:role).find_by_id(form.user_id)
    return redirect_to root_path if !(@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any? && Approver.where(user_id: user.id, approver_id: current_user.id, period_id: form.period_id).blank? && user.id != current_user.id
    @form_service.get_location_slot(@competencies.pluck(:id))
    @title = "View Suggest CDS/CDP For #{user.role.name} - #{user.format_name}"
    title = Title.where(role_id: user.role.id).where("rank >= ?", form.rank).order(:rank)
    @slots = @form_service.get_location_slot(@competencies.pluck(:id)).values.flatten.uniq.sort
    @hash = {
      name: title,
    }
  end

  def get_suggest_level
    return render json: { data: @form_service.get_suggest_level }
  end
  
  def get_data_suggest
    return render json: { data: @form_service.get_data_suggest }
  end

  def data_view_result
    render json: { data: @form_service.data_view_result }
  end

  def destroy
    form = Form.find_by_id(params[:id])
    return render json: { status: "can't delete form" } if form.status != "New"
    if form.update(is_delete: true)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def submit
    form = Form.where(id: params[:form_id], user_id: current_user.id).last
    return render json: { status: "fail_form" } if form.nil?
    return render json: { status: "fail_cdp" } if Comment.includes(:form_slot).where(form_slots: { form_id: params[:form_id] },is_commit: true, point: nil).blank?

    if params[:period_id].to_i > 0
      period = params[:period_id].to_i
      schedules = Schedule.includes(:period).where(company_id: current_user.company_id, period_id: period, status: "In-progress").order("periods.to_date")
      return render json: { status: "fails" } if schedules.blank?
    else
      schedules = Schedule.includes(:period).where(company_id: current_user.company_id, status: "In-progress").order("periods.to_date")
      return render json: { status: "fails" } if schedules.blank?
      period = schedules.last.period_id
    end
    if Approver.where(user_id: form.user_id, period_id: period, is_approver: false).empty? && !User.find_by_id(form.user_id).allow_null_reviewer
      approver_prev_period = Approver.includes(:period).where(user_id: current_user.id, is_approver: false).order("periods.to_date").last&.period_id
      approver_prevs = Approver.where(user_id: current_user.id, is_approver: false, period_id: approver_prev_period)
      approver_prevs.each do |approver_prev|
        Approver.create(approver_id: approver_prev.approver_id, user_id: current_user.id, is_approver: false, period_id: period)
      end
    end
    if Approver.where(user_id: form.user_id, period_id: period, is_approver: true).empty?
      approver_prev = Approver.includes(:period).where(user_id: current_user.id, is_approver: true).order("periods.to_date").last
      Approver.create(approver_id: approver_prev.approver_id, user_id: current_user.id, is_approver: true, period_id: period) unless approver_prev.nil?
    end
    users = User.joins(:approvers).where("approvers.user_id": form.user_id, "approvers.is_approver": false, "approvers.period_id": period)
    status, action, users = if users.empty?
        ["Awaiting Approval", "approve", User.joins(:approvers).where("approvers.user_id": form.user_id, "approvers.period_id": period)]
      else
        ["Awaiting Review", "review", users]
      end
    return render json: { status: "fail" } if users.empty?

    render json: { status: "success", form_status: status } if form.update(period_id: period, status: status, submit_date: DateTime.now)
    user = form.user
    period = Period.find_by_id(period)
    old_comment = Comment.includes(:form_slot).where(form_slots: { form_id: params[:form_id] }, is_delete: true)
    old_comment.destroy_all
    Async.await do
      CdsAssessmentMailer.with(user: user, from_date: period.from_date, to_date: period.to_date, approvers: users.to_a, action: action).
        user_submit.deliver_later(wait: 3.seconds)
    end
  end

  def reviewer_submit
    form = Form.find_by_id(params[:form_id])
    reviewer = Approver.where(user_id: params[:user_id], approver_id: current_user.id, period_id: form.period_id)
    return render json: { status: "fail" } if reviewer.blank?
    project_ids = ProjectMember.where(user_id: params[:user_id]).pluck(:project_id)
    # user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
    # get PM from same project user list
    user_pms = Approver.where(user_id: params[:user_id], is_approver: true, period_id: form.period_id)
    if reviewer.update(is_submit_cds: true)
      approvers = Approver.where(user_id: params[:user_id], period_id: form.period_id)
      user = User.find_by_id(params[:user_id])
      if approvers.where(is_submit_cds: false, is_approver: false).count.zero?
        return render json: { status: "fail" } unless form.update(status: "Awaiting Approval", approved_date: DateTime.now())
        Async.await do
          user_pms.each do |user_pm|
            CdsAssessmentMailer.with(staff: user, pm: user_pm.approver).email_to_pm.deliver_later(wait: 5.seconds)
          end
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
    user_name = User.find_by_id(params[:user_id]).format_name
    status = @form_service.reject_cds
    render json: { status: status, user_name: user_name }
  end

  def withdraw_cds
    user_name = current_user.format_name
    status = @form_service.withdraw_cds
    render json: { status: status, user_name: user_name }
  end

  def get_cds_histories
    render json: @form_service.get_data_view_history
  end

  def review_cds_assessment
    params = form_params
    @hash = {}
    schedules = Schedule.includes(:period).where(company_id: 1).where.not(status: "Done").order("periods.to_date")
    @period = schedules.map do |schedule|
      {
        id: schedule.period_id,
        name: schedule.period.format_name,
      }
    end
    return title_history_id = params[:title_history_id] if params[:title_history_id].present?
    if params.include?(:form_id)
      form = Form.where(user_id: current_user.id, id: params[:form_id]).first
      return if form.nil?
    else
      form = Form.includes(:template).where(user_id: current_user.id).order(created_at: :desc).first
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
    data = if @privilege_array.include?(FULL_ACCESS)
        @form_service.data_filter_cds_view_others
      elsif @privilege_array.include?(FULL_ACCESS_MY_COMPANY)
        @form_service.data_filter_cds_view_others(current_user.company_id)
      elsif (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?
        @form_service.data_filter_cds_approve
      elsif @privilege_array.include?(REVIEW_CDS)
        @form_service.data_filter_cds_review
      else
        redirect_to root_path
      end
    render json: data
  end

  def data_filter_projects
    if params[:company_id].first == "0"
      projects = Project.select("projects.name as name", :id)
    else
      projects = Project.select("projects.name as name", :id).where(company_id: params[:company_id])
    end

    render json: { projects: projects || [] }
  end

  def data_filter_users
    if @privilege_array.include?(FULL_ACCESS)
      user_ids = User.where(is_delete: false)
    elsif @privilege_array.include?(FULL_ACCESS_MY_COMPANY)
      user_ids = User.where(company_id: current_user.company_id, is_delete: false)
    elsif (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?     
      if params[:period].include?("0") || params[:period].nil?
        user_ids = Approver.where(approver_id: current_user.id).pluck(:user_id)
      else
        user_ids = Approver.where(approver_id: current_user.id, period_id: params[:period]).pluck(:user_id)
      end
    elsif @privilege_array.include?(REVIEW_CDS)
      project_members = ProjectMember.where(user_id: current_user.id).includes(:project)
      user_ids = ProjectMember.where(project_id: project_members.pluck(:project_id)).pluck(:user_id).uniq
    else
      redirect_to root_path
    end

    filter = { id: user_ids }
    filter[:company_id] = params[:company_id] unless params[:company_id].length == 1 && params[:company_id].first == "0"
    filter[:role_id] = params[:role_id] unless params[:role_id].length == 1 && params[:role_id].first == "0"

    users = User.includes(:project_members).where(filter)
    unless params[:project_id].length == 1 && params[:project_id].first == "0"
      users = users.where(project_members: { project_id: params[:project_id] })
    end

    results = users.map do |user|
      {
        id: user.id,
        name: user.format_name_vietnamese,
      }
    end
    render json: { users: results || [] }
  end

  private

  def get_privilege_assessment
    user_id = Form.where(id: params[:form_id]).pluck(:user_id)
    user_id = user_id.present? ? user_id : current_user.id
    project_ids = ProjectMember.where(user_id: user_id).pluck(:project_id)
    user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
    @is_approver = false
    @is_reviewer = @privilege_array.include?(REVIEW_CDS) && user_ids.include?(current_user.id)

    if (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any? && user_ids.include?(current_user.id)
      @is_reviewer = false
      @is_approver = true
    end
  end

  def check_privilege
    if (params[:action] == "cds_review")
      check_line_manager_privilege
    elsif (params[:action] == "index_cds_cdp")
      check_staff_privilege
    end
  end

  def check_staff_privilege
    redirect_to root_path unless @privilege_array.include?(VIEW_CDS_CDP_ASSESSMENT)
  end

  def check_line_manager_privilege
    redirect_to root_path unless (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY, APPROVE_CDS, REVIEW_CDS, HIGH_FULL_ACCESS]).any?
  end

  def form_service
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def export_service
    @export_service ||= Api::ExportService.new(form_params, current_user)
  end

  def form_params
    params[:offset] = params[:iDisplayStart]

    params
  end
end
