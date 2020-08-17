class ScheduleMailer < ApplicationMailer
  default from: "hr@bestarion.com"
  #Ex:- :default =>''
  def notice_mailer
    @user = params[:user]
    @schedule = params[:schedule]
    @period = params[:period]
    emails = @user.collect(&:email).join(", ")
    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}]")
  end

  def edit_mailer
    @user = params[:user]
    @schedule = params[:schedule]
    @period = params[:period]

    emails = @user.collect(&:email).join(", ")
    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}] - update")
  end

  def del_mailer
    @user = params[:user]
    @period = params[:period]

    emails = @user.collect(&:email).join(", ")
    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}] - delete")
  end

  def phase1_mailer
    @user = params[:user]
    @period = params[:period]
    @schedule = params[:schedule]
    @sender = params[:sender]
    emails = @user.collect(&:email).join(", ")

    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}] for team member")
  end

  def phase2_mailer
    @user = params[:user]
    @period = params[:period]
    @schedule = params[:schedule]
    @sender = params[:sender]
    emails = @user.collect(&:email).join(", ")

    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}]")
  end

  def phase3_mailer
    @user = params[:user]
    @period = params[:period]
    @schedule = params[:schedule]
    @sender = params[:sender]
    emails = @user.collect(&:email).join(", ")

    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}] for Reviewer")
  end

  def pm_create_schedule_for_project
    user = params[:user]
    @schedule = params[:schedule]
    @period = params[:period]
    @end_date_member = params[:end_date_member]
    @end_date_reviewer = params[:end_date_reviewer]
    @notify_member = params[:notify_member]
    emails = user.collect(&:email).join(", ")
    #mail(to: emails, subject: "[CDS System] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")}  to #{@period.to_date.strftime("%b %d, %Y")}] for team member")
  end
end
