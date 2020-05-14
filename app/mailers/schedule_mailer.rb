class ScheduleMailer < ApplicationMailer
  default from: "hr@bestarion.com"
  #Ex:- :default =>''
  def notice_mailer
    @admin_user = params[:admin_user]
    @schedule = params[:schedule]
    @period = params[:period]
    emails = @admin_user.collect(&:email).join(', ')
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime('%b %d, %Y')} to #{@period.to_date.strftime('%b %d, %Y')}]" )
  end
  

  def edit_mailer
    @admin_user = params[:admin_user]
    @schedule = params[:schedule]
    @period = params[:period]
    
    emails = @admin_user.collect(&:email).join(', ')
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime('%b %d, %Y')} to #{@period.to_date.strftime('%b %d, %Y')}] - update" )
  end
  
  def del_mailer
    @admin_user = params[:admin_user]
    @period = params[:period]
    
    emails = @admin_user.collect(&:email).join(', ')
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime('%b %d, %Y')} to #{@period.to_date.strftime('%b %d, %Y')}] - delete" )
  end
  
end
