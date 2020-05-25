class CdsAssessmentMailer < ApplicationMailer
  # default from: "hr@bestarion.com"
  def commit
    @user = params[:user]
    emails = @user.collect(&:email).join(", ")
    mail(to: emails, subject: "[CDS system] CDS Assessment ")
  end
end
