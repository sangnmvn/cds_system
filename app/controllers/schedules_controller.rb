class SchedulesController < ApplicationController
  before_action :get_privilege_id
  before_action :check_privilege
  before_action :set_schedule, only: [:show, :edit, :update, :destroy]
  layout "system_layout"
  ROLE_NAME = ["PM", "SM", "BOD"]
  FULL_ACCESS_SCHEDULE_COMPANY = 13
  FULL_ACCESS_SCHEDULE_PROJECT = 14

  def get_schedule_data
    if check_hr?
      schedules = Schedule.joins(:user, :company).where(_type: "HR").search_schedule(set_params[:search]).offset(set_params[:offset]).limit(LIMIT).order(get_sort_params)
    elsif check_pm?
      schedules = Schedule.joins(:user, :company).where(_type: "PM").search_schedule(set_params[:search]).where(company_id: current_user.company_id).offset(set_params[:offset]).limit(LIMIT).order(get_sort_params)
    end

    render json: { iTotalRecords: schedules.count, iTotalDisplayRecords: schedules.unscope([:limit, :offset]).count, aaData: format_data(schedules) }
  end

  def get_schedule_hr_info
    temp_params = hr_schedule_params
    period_id = temp_params[:id]

    begin
      schedule_hr = Schedule.where(period_id: period_id).first
      render json: { status: "success", start_date_hr: schedule_hr.start_date.strftime("%b %d, %Y"), end_date_hr: schedule_hr.end_date_hr.strftime("%b %d, %Y") }
    rescue
      render json: { status: "fail" }
    end
  end

  def format_data(schedules)
    schedules.map.with_index do |schedule, index|
      current_schedule_data = []

      if schedule.status.downcase == "new"
        current_schedule_data.push("<input type='checkbox' name='checkbox' id='schedule_ids_' value='#{schedule.id}' class='selectable'>")
      else
        current_schedule_data.push("")
      end

      number = set_params[:offset] + index + 1
      current_schedule_data.push("<td style='text-align:right'>#{number}</td>")
      current_schedule_data.push(schedule.desc)

      current_schedule_data.push(schedule.company.name)
      if check_pm?
        # project_ids = ProjectMember.where(user_id: current_user.id).pluck(:project_id)
        project_name = Project.where(id: schedule.project_id).pluck(:name).join(", ")
        current_schedule_data.push(project_name)
      end

      current_schedule_data.push("#{schedule.period.format_long_date}")
      current_schedule_data.push(schedule.start_date.strftime("%b %d, %Y"))
      current_schedule_data.push(schedule.end_date_hr.strftime("%b %d, %Y"))
      current_schedule_data.push(schedule.status)
      if schedule.status.downcase == "in-progress" || schedule.status.downcase == "done"
        current_schedule_data.push("<td style='text-align: center;'>      
          <a class='edit_btn' enable='true' data-schedule='#{schedule.id}' data-tooltip='true' data-placement='top' href='javascript:void(0)' title='Edit schedule'><i class='fa fa-pencil icon' style='color:#fc9803'></i></a>
          <a class='del_btn'  href='javascript:void(0)' title='Delete schedule'><i class='fa fa-trash icon' style='color:grey'></i></a>
        </td>")
      elsif schedule.status.downcase == "new"
        current_schedule_data.push("<td style='text-align: center;'>      
          <a class='edit_btn' enable='true' data-schedule='#{schedule.id}' data-tooltip='true' data-placement='top' href='javascript:void(0)' title='Edit schedule'><i class='fa fa-pencil icon' style='color:#fc9803'></i></a>
          <a class='del_btn'  enable='true' data-schedule='#{schedule.id}' data-tooltip='true' data-placement='top' href='javascript:void(0)' title='Delete schedule'><i class='fa fa-trash icon' style='color:red'></i></a>
        </td>")
      else
        current_schedule_data.push("")
      end
    end
  end

  def set_params
    {
      offset: params[:iDisplayStart].to_i,
      search: params[:sSearch],
    }
  end

  def add_page
    if check_hr?
      company = Company.where(is_enabled: true).pluck(:name, :id)
    elsif check_pm?
      company = Company.where(id: current_user.company_id, is_enabled: true).pluck(:name, :id)
    end
    render json: company
  end

  def index
    if check_hr?
      @company = Company.pluck(:name, :id)
      @fields = ["No.", "Schedule name", "Company name", "Assessment period", "Start date", "End date", "Status", "Action"]
    else
      @company = Company.where(id: current_user.company_id).pluck(:name, :id)
      @fields = ["No.", "Schedule name", "Company name", "Project Name", "Assessment period", "Start date", "End date", "Status", "Action"]
      parent_schedules = Schedule.includes(:period).select(:id, :period_id).where(_type: "HR", status: ["New", "In-progress"], company_id: current_user.company_id)
      @period = parent_schedules.map do |schedule|
        [
          schedule.period.format_long_date,
          schedule.period_id,
        ]
      end
    end

    @schedules = Schedule.includes(:user, :company).order(id: :DESC).page(params[:page]).per(20)
    @is_pm = check_pm?
    @is_hr = check_hr?
    @project = Project.distinct.joins(:project_members).where(company_id: current_user.company_id)
  end

  def new
    filter = {}
    filter[:id] = current_user.company_id if check_pm?

    @company = Company.where(filter).order(:name).pluck(:name, :id)

    @project = Project.joins(:project_members).where(project_members: { user_id: current_user.id })
    @parent_schedules = Schedule.includes(:period).select(:id, :period_id).where(_type: "HR", status: ["New", "In-progress"])
    @schedule = Schedule.new
  end

  def show
    @schedule = Schedule.includes(:company, :period).find_by_id(params[:id])

    respond_to do |format|
      format.js
    end
  end

  def mailer
  end

  def create
    temp_params = schedule_params
    temp_params.delete(:id)
    if check_hr?
      temp_params[:end_date_hr] = helpers.date_format(params[:end_date_hr])
      temp_params[:start_date] = helpers.date_format(params[:start_date])
      temp_params[:_type] = "HR"
      # format date from period
      period_params_temp = period_params
      period_params_temp[:status] = temp_params[:status]
      period_params_temp[:from_date] = helpers.date_format(params[:from_date])
      period_params_temp[:to_date] = helpers.date_format(params[:to_date])

      @period = Period.new(period_params_temp)
      if @period.save
        temp_params[:period_id] = @period.id
        @schedule = Schedule.new(temp_params)
        if @schedule.save
          @schedules = Schedule.order(id: :desc).page(params[:page]).per(20)
          user = User.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": params[:company_id])
          cp_reviewer_approver_to_new_period(@period.id, @schedule.company_id)
          # send mail
          ScheduleMailer.with(user: user.to_a, schedule: @schedule, period: @period).notice_mailer.deliver_later(wait: 1.minute)

          render json: { status: true }
        else
          render json: { status: false }
        end
      else
        render json: { status: false }
      end
    elsif check_pm?
      temp_params[:end_date_employee] = temp_params[:end_date_member]

      temp_params.delete(:end_date_member)
      temp_params[:notify_employee] = temp_params[:notify_member]
      temp_params[:notify_reviewer] = temp_params[:notify_member]
      temp_params.delete(:notify_member)
      schedule_parent_id = temp_params[:schedule_hr_parent]
      temp_params.delete(:schedule_hr_parent)

      temp_params[:end_date_hr] = helpers.date_format(params[:end_date_hr])
      temp_params[:start_date] = helpers.date_format(params[:start_date])
      temp_params[:_type] = "PM"

      # reuse existing period of parents
      period = Period.find_by_id(schedule_parent_id)
      parent_schedule = Schedule.where(period_id: period.id).first
      temp_params[:period_id] = period.id
      temp_params[:notify_hr] = parent_schedule.notify_hr
      @schedule = Schedule.new(temp_params)

      if @schedule.save
        @schedules = Schedule.order(id: :desc).page(params[:page]).per(20)
        project_id = ProjectMember.where(user_id: current_user.id).pluck(:project_id).uniq
        user = User.joins(:project_members, :company).where(is_delete: false, "companies.id": params[:company_id], "project_members.project_id": project_id).where.not(id: current_user.id).uniq
        ScheduleMailer.with(user: user.to_a, schedule: @schedule, period: period, end_date_member: params[:end_date_member], end_date_reviewer: params[:end_date_reviewer], notify_member: params[:notify_member]).pm_create_schedule_for_project.deliver_later(wait: 1.minute)
        render json: { status: true }
      else
        render json: { status: false }
      end
    end
  end

  def edit_page
    schedule = Schedule.find_by_id(params[:id])
    @is_pm = check_pm?
    @is_hr = check_hr?
    project_ids = ProjectMember.where(user_id: current_user.id, is_managent: 1).pluck(:project_id)

    @parent_schedules = Schedule.joins(:period, :company, :project).select(:period_id, :from_date, :to_date).where(_type: "HR", status: ["New", "In-progress"], end_date_hr: schedule[:end_date_hr], start_date: schedule[:start_date]).limit(1)
    if @is_pm
      render json: {
               schedule_id: schedule.id,
               schedule_name: schedule.desc,
               company_id: schedule.company.id,
               company_name: schedule.company.name,
               project_id: schedule.project.id,
               project_name: schedule.project.name,
               assessment_period: schedule.period.format_long_date,
               period_id: schedule.period_id,
               start_date: schedule.start_date.strftime("%b %d, %Y"),
               end_date_hr: schedule.end_date_hr.strftime("%b %d, %Y"),
               end_date_employee: schedule.end_date_employee.strftime("%b %d, %Y"),
               end_date_reviewer: schedule.end_date_reviewer.strftime("%b %d, %Y"),
               notify_employee: schedule.notify_employee,
               status: schedule.status,
             }
    elsif @is_hr
      render json: {
        schedule_id: schedule.id,
        schedule_name: schedule.desc,
        company_id: schedule.company.id,
        company_name: schedule.company.name,
        assessment_period_from_date: schedule.period.from_date.strftime("%b %d, %Y"),
        assessment_period_to_date: schedule.period.to_date.strftime("%b %d, %Y"),
        start_date: schedule.start_date.strftime("%b %d, %Y"),
        end_date_hr: schedule.end_date_hr.strftime("%b %d, %Y"),
        notify_hr: schedule.notify_hr,
        status: schedule.status,
      }
    end
  end

  def destroy_page
    schedule = Schedule.find_by_id(params[:id])
    render json: { status: true, id: schedule.id }
  end

  def destroy
    schedule = Schedule.find_by(id: params[:id], status: "New")
    return render json: { status: false } if schedule.nil?
    period_id = schedule.period_id
    period = Period.find_by_id(period_id)
    user = User.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": schedule.company_id)
    ScheduleMailer.with(user: user.to_a, period: period).del_mailer.deliver_later(wait: 1.minute)
    approvers = Approver.where(period_id: period_id)
    return render json: { status: true } if approvers.destroy_all && period.destroy && schedule.destroy
    render json: { status: false }
  end

  def destroy_multiple
    if params[:schedule_ids] != nil
      schedule = Schedule.includes(:period).where(id: params[:schedule_ids])

      schedule.each do |schedule|
        user = User.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": schedule.company_id)
        ScheduleMailer.with(user: user.to_a, period: schedule.period).del_mailer.deliver_later(wait: 1.minute)
        schedule.destroy
      end
      render json: { status: true }
    else
      render json: { status: false }
    end
  end

  def update
    if check_hr?
      temp_params = schedule_params
      temp_params[:end_date_hr] = helpers.date_format(params[:end_date_hr])
      temp_params[:status] = params[:status] if params[:status].present? && ["Done","In-progress"].include?(params[:status])
    elsif check_pm?
      temp_params = pm_update_schedules_param
      temp_params[:end_date_employee] = helpers.date_format(params[:end_date_member])
      temp_params[:end_date_reviewer] = helpers.date_format(params[:end_date_reviewer])
      temp_params.delete(:end_date_member)
      temp_params[:notify_employee] = temp_params[:notify_member]
      temp_params[:notify_reviewer] = temp_params[:notify_member]
      temp_params.delete(:notify_member)
      temp_params[:status] = params[:status] if params[:status].present? && ["Done","In-progress"].include?(params[:status])
    end

    if @schedule.update(temp_params)
      user = User.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": @schedule.company_id)
      if check_hr?
        ScheduleMailer.with(user: user.to_a, schedule: @schedule, period: @schedule.period).edit_mailer_hr.deliver_later(wait: 1.minute)
      elsif check_pm?
        ScheduleMailer.with(user: user.to_a, schedule: @schedule, period: @schedule.period).edit_mailer_pm.deliver_later(wait: 1.minute)
      end
      @schedules = Schedule.order(id: :desc).page(params[:page]).per(20)
      if temp_params[:status] == "Done"
        schedule_pm = Schedule.where(company_id: @schedule.company_id, period_id: @schedule.period_id, _type: "PM")
        schedule_pm.update(status: "Done")
      end
      render json: { status: true }
    else
      render json: { status: false }
    end
  end

  private

  def cp_reviewer_approver_to_new_period(period_id, company_id)
    prev_period_id = Schedule.includes(:period).where(company_id: company_id).where.not(period_id: period_id).order("periods.to_date").pluck(:period_id).last
    approver_prevs = Approver.where(period_id: prev_period_id)

    approver_prevs.each do |approver_prev|
      new_apporver = approver_prev.dup
      new_apporver.period_id = period_id
      new_apporver.save
    end
  end

  def check_pm?
    permission_pm = @privilege_array.include?(FULL_ACCESS_SCHEDULE_PROJECT) && !@privilege_array.include?(FULL_ACCESS_SCHEDULE_COMPANY)
  end

  def check_hr?
    permission_hr = @privilege_array.include?(FULL_ACCESS_SCHEDULE_COMPANY)
  end

  def check_privilege
    redirect_to root_path unless (@privilege_array & [FULL_ACCESS_SCHEDULE_PROJECT, FULL_ACCESS_SCHEDULE_COMPANY]).any?
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_schedule
    @schedule = Schedule.includes(:period).find_by_id(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def get_sort_params
    return { id: :desc } if params[:iSortCol_0] == "0"
    sort = case params[:iSortCol_0]
      when "1"
        :id
      when "2"
        :desc
      when "3"
        :"companies.name"
      end

    { sort => params[:sSortDir_0] || :desc }
  end

  def schedule_params
    params.permit(:id, :project_id, :period_id, :schedule_hr_parent, :start_date, :end_date_hr, :end_date_member, :end_date_reviewer, :notify_reviewer, :company_id, :user_id, :desc, :status, :notify_employee, :notify_member, :is_delete, :notify_hr)
  end

  def hr_schedule_params
    params.permit(:id)
  end

  def pm_update_schedules_param
    params.permit(:id, :end_date_member, :end_date_reviewer, :notify_member)
  end

  def period_params
    params.permit(:id, :from_date, :to_date)
  end
end
