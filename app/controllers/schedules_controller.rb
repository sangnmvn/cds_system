class SchedulesController < ApplicationController
  before_action :set_schedule, only: [:show, :edit, :update, :destroy]
  layout "system_layout"
  ROLE_NAME = ["PM", "SM", "BOD"]

  def index
    # binding.pry
    @fields = ["No.", "Schedule name", "Company name", "Period", "Start date", "Status", "Action"]
    if current_admin_user.role.name == "HR"
      @fields.insert(5, "End date")
      @company = Company.all
      @schedules = Schedule.includes(:admin_user, :company).where(is_delete: false).order(id: :DESC).page(params[:page]).per(20)
    else
      @fields.insert(4, "Employee end date", "Reviewer end date")
      @projects = Project.joins(project_members: [:admin_user]).where("admin_users.id = ?", current_admin_user.id)
    end
  end

  def new
    @schedule = Schedule.new
  end

  def show
  end

  def mailer
  end

  def create
    # format date from schedule
    temp_params = schedule_params
    temp_params[:end_date_hr] = helpers.date_format(params[:end_date_hr])
    temp_params[:start_date] = helpers.date_format(params[:start_date])
    # format date from period
    period_params_temp = period_params
    period_params_temp[:from_date] = helpers.date_format(params[:from_date])
    period_params_temp[:to_date] = helpers.date_format(params[:to_date])

    # binding.pry

    @period = Period.new(period_params_temp)
    respond_to do |format|
      if @period.save
        temp_params[:period_id] = @period.id
        @schedule = Schedule.new(temp_params)
        if @schedule.save
          # binding.pry
          @schedules = Schedule.where(is_delete: false).order(id: :DESC).page(params[:page]).per(20)
          admin_user = AdminUser.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": params[:company_id])
          # send mail
          ScheduleMailer.with(admin_user: admin_user.to_a, schedule: @schedule, period: @period).notice_mailer.deliver_now
          format.js { @status = true }
        else
          format.js { @status = false }
        end
      else
        format.js { @status = false }
      end
    end
  end

  def edit_page
    respond_to do |format|
      @schedule = Schedule.find(params[:id])
      @company = Company.all
      
      @schedule[:end_date_hr] = DateTime.strptime(@schedule[:end_date_hr].to_s, "%Y-%m-%d").strftime("%Y-%m-%d")
      @schedule[:start_date] = DateTime.strptime(@schedule[:start_date].to_s, "%Y-%m-%d").strftime("%Y-%m-%d")

      format.js
    end
  end

  def destroy_page
    @schedule = Schedule.find(params[:id])

    respond_to do |format|
      format.js
    end
  end

  def destroy
    @schedule = Schedule.find(params[:id])

    respond_to do |format|
      if @schedule.update(is_delete: true)
        @schedules = Schedule.includes(:admin_user, :project).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
        @schedules.each { |schedule| update_Status(schedule) }
        format.js { @status = true }
      else
        format.js { @status = false }
      end
    end
  end

  def destroy_multiple
    if params[:schedule_ids] != nil
      schedule = Schedule.find(params[:schedule_ids])
      schedule.each do |schedule|
        schedule.update_attribute(:is_delete, true)
      end
    end
    respond_to do |format|
      @schedules = Schedule.all.includes(:admin_user, :project).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
      @schedules.each { |schedule| update_Status(schedule) }
      format.js { @status = true }
    end
  end

  def update
    @schedule = Schedule.find(params[:id])

    respond_to do |format|
      if @schedule.update(schedule_params_2)
        @schedules = Schedule.all.includes(:admin_user, :project).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
        @schedules.each { |schedule| update_Status(schedule) }
        format.js { @status = true }
      else
        format.js { @status = false }
      end
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_schedule
    @schedule = Schedule.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def schedule_params
    params.permit(:id, :project_id, :period_id, :start_date, :end_date_hr, :end_date_employee, :end_date_reviewer, :notify_reviewer, :company_id, :admin_user_id, :desc, :status, :notify_employee, :is_delete, :notify_hr)
  end

  def period_params
    params.permit(:id, :from_date, :to_date)
  end

  def schedule_params_2
    params.permit(:project_id, :start_date, :end_date, :notify_date)
  end

  def update_Status(schedule)
    current_time = DateTime.now.to_s

    # binding.pry

    if current_time > schedule.end_date.to_s
      schedule.status = "Done"
    elsif current_time >= schedule.start_date.to_s
      schedule.status = "In-progress"
    else
      schedule.status = "New"
    end
  end
end
