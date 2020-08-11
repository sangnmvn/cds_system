class UserMailer < ApplicationMailer
  def reset_password_notif
    @account = params[:account]
    mail(to: params[:email], subject: "[CDS System] Reset Password")
  end
end
