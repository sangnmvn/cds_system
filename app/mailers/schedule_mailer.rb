class ScheduleMailer < ApplicationMailer
  default from: "hr@bestarion.com"
  #Ex:- :default =>''
  def notice_mailer
    @admin_user = params[:admin_user]
    @schedule = params[:schedule]
    @period = params[:period]
    
    # binding.pry
    
    emails = @admin_user.collect(&:email).join(', ')
    mail(to: emails, subject: "[CDS system] CDS Assessment Schedule in [from #{@period.from_date.strftime('%b %d, %Y')} to #{@period.to_date.strftime('%b %d, %Y')}]" )
  end
  
end
