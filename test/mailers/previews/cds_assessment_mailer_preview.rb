# Preview all emails at http://localhost:3000/rails/mailers/cds_assessment_mailer
class CdsAssessmentMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/cds_assessment_mailer/commit
  def user_submit
    CdsAssessmentMailer.user_submit
  end

end
