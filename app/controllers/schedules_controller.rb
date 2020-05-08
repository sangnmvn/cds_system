class SchedulesController < ApplicationController
  before_action :set_schedule, only: [:show, :edit, :update, :destroy]
  layout "system_layout"

  def index
    # binding.pry
    @fields = ["No.", "Schedule name" ,"Created by", "Start date", "Status", "Action"]
    if current_admin_user.role.name == "HR"
      @fields.insert(4, "End date")
      @company = Company.all
      @schedules = Schedule.all.includes(:admin_user, :company).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
    else
      @fields.insert(4,"Employee end date", "Reviewer end date")
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
    # @schedule = Schedule.new(admin_user_id: current_admin_user.id, project_id: params[:project], start_date: DateTime.strptime(params[:start_date], "%H:%M %m/%d/%Y").strftime("%d-%m-%Y %H:%M"),
    #                          end_date: DateTime.strptime(params[:end_date], "%H:%M %m/%d/%Y").strftime("%d-%m-%Y %H:%M"), notify_date: params[:notify_date])
    
    
    schedule_params[:end_date_hr] = Date.strptime(params[:end_date_hr], '%m/%d/%Y').to_date
    schedule_params[:start_date] = Date.strptime(params[:start_date], '%m/%d/%Y').to_date
    @schedule = Schedule.new(schedule_params )
    
    binding.pry
    
    respond_to do |format|
      if @schedule.save
        # binding.pry
        @schedules = Schedule.all.includes(:admin_user, :company).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
        admin_user = AdminUser.joins(:company, :role).where("roles.name IN ('PM', 'SM', 'BDD') and admin_users.is_delete = false and companies.id = ? ", params[:company_id])
        # ScheduleMailer.with(admin_user: admin_user, schedule: @schedule).notice_mailer.deliver_later
        

        format.js { @status = true }
      else
        format.js { @status = false }
      end
    end
  end

  def edit_page
    @schedule = Schedule.find(params[:id])

    @end_date = DateTime.strptime(@schedule[:end_date].to_s, "%Y-%m-%d %H:%M").strftime("%H:%M %m/%d/%Y")
    @start_date = DateTime.strptime(@schedule[:start_date].to_s, "%Y-%m-%d %H:%M").strftime("%H:%M %m/%d/%Y")

    update_Status(@schedule)
    @projects = Project.all
    respond_to do |format|
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
    params.permit(:id, :project_id, :start_date, :end_date_hr, :end_date_employee, :end_date_reviewer , :notify_reviewer \
    , :company_id, :admin_user_id, :desc , :status , :notify_employee, :is_delete, :notify_hr)
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
