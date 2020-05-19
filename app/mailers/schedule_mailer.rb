class ScheduleMailer < ApplicationMailer
  default from: "hr@bestarion.com"
  #Ex:- :default =>''
  def notice_mailer
    @user = params[:user]
    @schedule = params[:schedule]
    @period = params[:period]
    emails = @user.collect(&:email).join(", ")
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}]")
  end

  def edit_mailer
    @user = params[:user]
    @schedule = params[:schedule]
    @period = params[:period]

    emails = @user.collect(&:email).join(", ")
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}] - update")
  end

  def del_mailer
    @user = params[:user]
    @period = params[:period]

    emails = @user.collect(&:email).join(", ")
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime("%b %d, %Y")} to #{@period.to_date.strftime("%b %d, %Y")}] - delete")
  end
end
