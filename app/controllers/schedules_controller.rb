class SchedulesController < ApplicationController
  before_action :set_schedule, only: [:show, :edit, :update, :destroy]
  layout "system_layout"

  def index
    # binding.pry
    @fields = ["No.", "Schedule name", "Created by", "Start date", "Status", "Action"]
    if current_admin_user.role.name == "HR"
      @fields.insert(4, "End date")
      @company = Company.all
      @schedules = Schedule.all.includes(:admin_user, :company).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
    else
      @fields.insert(4, "Employee end date", "Reviewer end date")
      @projects = Project.joins(project_members: [:admin_user]).where("admin_users.id = ?", current_admin_user.id)
    end
  end

  def new
    @schedule = Schedule.new
    respond_to do |format|
      format.js { render layout: false, content_type: "text/javascript" }
    end
  end

  def show
  end

  def mailer
  end

  def create
    # format date from schedule
    temp_params = schedule_params
    end_date_formatter = params[:end_date_hr].split("/").map(&:to_i)
    temp_params[:end_date_hr] = Date.new(end_date_formatter[2], end_date_formatter[0], end_date_formatter[1]).strftime("%Y-%m-%d")

    start_date_formatter = params[:start_date].split("/").map(&:to_i)
    temp_params[:start_date] = Date.new(start_date_formatter[2], start_date_formatter[0], start_date_formatter[1]).strftime("%Y-%m-%d")
    # format date from period
    period_params_temp = period_params
    from_date_formatter = params[:from_date].split("/").map(&:to_i)
    period_params_temp[:from_date] = Date.new(from_date_formatter[2], from_date_formatter[0], from_date_formatter[1]).strftime("%Y-%m-%d")

    to_date_formatter = params[:to_date].split("/").map(&:to_i)
    period_params_temp[:to_date] = Date.new(to_date_formatter[2], to_date_formatter[0], to_date_formatter[1]).strftime("%Y-%m-%d")
    
    # binding.pry
    
    @period = Period.new(period_params_temp)
    if @period.save
    
    respond_to do |format|
        temp_params[:period_id] = @period.id
        @schedule = Schedule.new(temp_params)
        if @schedule.save
          # binding.pry
          @schedules = Schedule.all.includes(:admin_user, :company).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
          admin_user = AdminUser.joins(:company, :role).where("roles.name IN ('PM', 'SM', 'BDD') and admin_users.is_delete = false and companies.id = ? ", params[:company_id])
          # send mail
          ScheduleMailer.with(admin_user: admin_user.to_a, schedule: @schedule, period: @period).notice_mailer.deliver_now
          format.js { @status = true }
        else
          format.js { @status = false }
        end
      end
    end
  end

  def edit_page
    respond_to do |format|
      @schedule = Schedule.find(params[:id])
      @company = Company.all
      # binding.pry

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
        @schedules = Schedule.all.includes(:admin_user, :project).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
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
    params.permit(:id, :project_id, :period_id,:start_date, :end_date_hr, :end_date_employee, :end_date_reviewer, :notify_reviewer, :company_id, :admin_user_id, :desc, :status, :notify_employee, :is_delete, :notify_hr)
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
