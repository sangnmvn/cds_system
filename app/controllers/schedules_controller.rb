class SchedulesController < ApplicationController
  before_action :set_schedule, only: [:show, :edit, :update, :destroy]
  layout "system_layout"

  def index
    @schedules = Schedule.all.includes(:admin_user, :project).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
    @projects = Project.all
    @schedules.each { |schedule| update_Status(schedule) }
  end

  def new
    @schedule = Schedule.new
    respond_to do |format|
      format.js { render layout: false, content_type: "text/javascript" }
    end
  end

  def show
  end

  def create
    @schedule = Schedule.new(admin_user_id: current_admin_user.id, project_id: params[:project], start_date: DateTime.strptime(params[:start_date], "%H:%M %m/%d/%Y").strftime("%d-%m-%Y %H:%M"),
                             end_date: DateTime.strptime(params[:end_date], "%H:%M %m/%d/%Y").strftime("%d-%m-%Y %H:%M"), notify_date: params[:notify_date])

    respond_to do |format|
      if @schedule.save
        @schedules = Schedule.all.includes(:admin_user, :project).where("is_delete = false").order("id DESC").page(params[:page]).per(20)
        @schedules.each { |schedule| update_Status(schedule) }

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
    params.require(:schedule).permit(:id)
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
