class ScheduleMailer < ApplicationMailer
  default from: "hr@bestarion.com"
  #Ex:- :default =>''
  def notice_mailer
    @admin_user = param[:admin_user]
    @schedule = param[:schedule]
    emails = @admin_user.collect(&:email).join(', ')
    mail(to: emails, subject: "Teestttt mailllerrr" )
  end
  
end
