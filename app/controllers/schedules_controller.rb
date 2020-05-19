class SchedulesController < ApplicationController
  include Authorize
  before_action :get_privilege_id
  before_action :set_schedule, only: [:show, :edit, :update, :destroy]
  layout "system_layout"
  ROLE_NAME = ["PM", "SM", "BOD"]

  def index
    @fields = ["No.", "Schedule name", "Company name", "Assessment period", "Start date", "Status", "Action"]
    if (@privilege_array & [13]).any?
      @fields.insert(5, "End date")
      @company = Company.all
      @schedules = Schedule.includes(:admin_user, :company).order(id: :DESC).page(params[:page]).per(20)
    else
      redirect_to root_path
    end
  end

  def new
    @schedule = Schedule.new
  end

  def show
    @schedule = Schedule.includes(:company, :period).find(params[:id])

    respond_to do |format|
      format.js
    end
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

    @period = Period.new(period_params_temp)
    respond_to do |format|
      if @period.save
        temp_params[:period_id] = @period.id
        @schedule = Schedule.new(temp_params)
        if @schedule.save
          @schedules = Schedule.order(id: :DESC).page(params[:page]).per(20)
          admin_user = AdminUser.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": params[:company_id])
          # send mail
          ScheduleMailer.with(admin_user: admin_user.to_a, schedule: @schedule, period: @period).notice_mailer.deliver_later(wait: 1.minute)
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
    @period = Period.find(@schedule.period_id)
    respond_to do |format|
      @period = Period.find(@schedule.period_id)
      admin_user = AdminUser.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": @schedule.company_id)
      ScheduleMailer.with(admin_user: admin_user.to_a, period: @period).del_mailer.deliver_later(wait: 1.minute)
      if @schedule.destroy && @period.destroy
        @schedules = Schedule.order(id: :DESC).page(params[:page]).per(20)
        format.js { @status = true }
      else
        format.js { @status = false }
      end
    end
  end

  def destroy_multiple
    respond_to do |format|
      if params[:schedule_ids] != nil
        schedule = Schedule.find(params[:schedule_ids])

        schedule.each do |schedule|
          period = Period.find(schedule.period_id)
          admin_user = AdminUser.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": schedule.company_id)
          ScheduleMailer.with(admin_user: admin_user.to_a, period: period).del_mailer.deliver_later(wait: 1.minute)
          schedule.destroy
        end
        @schedules = Schedule.order(id: :DESC).page(params[:page]).per(20)
        format.js { @status = true }
      else
        format.js { @status = false }
      end
    end
  end

  def update
    temp_params = schedule_params
    temp_params[:end_date_hr] = helpers.date_format(params[:end_date_hr])
    @schedule = Schedule.find(params[:id])
    respond_to do |format|
      if @schedule.update(temp_params)
        admin_user = AdminUser.joins(:role, :company).where("roles.name": ROLE_NAME, is_delete: false, "companies.id": @schedule.company_id)
        @period = Period.find(@schedule.period_id)
        ScheduleMailer.with(admin_user: admin_user.to_a, schedule: @schedule, period: @period).edit_mailer.deliver_later(wait: 1.minute)
        @schedules = Schedule.order(id: :DESC).page(params[:page]).per(20)
        format.js { @status = true }
      else
        format.js { @status = false }
      end
    end
  end

  private

  def check_privilege
  end

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
end
