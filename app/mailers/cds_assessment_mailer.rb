class CdsAssessmentMailer < ApplicationMailer
  # default from: "hr@bestarion.com"
  def user_submit
    user = params[:user]
    @firstname = user.first_name
    @firstcharacters = user.last_name.split(" ").map { |x| x.chr }.join
    reviewers = params[:reviewer]
    @reviewername = ""
    @emails = ""
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    reviewers.each_with_index do |reviewer, index|
      @reviewername += reviewer.approver.first_name + " " + reviewer.approver.last_name
      if index == 0
        @emails += reviewer.approver.email
      else
        @emails += ", " + reviewer.approver.email
      end
    end

    mail(to: @emails, subject: "[CDS system] CDS Assessment Request to review CDS assessment for #{@firstname} #{@firstcharacters}")
  end

  def user_add_more_evidence
    @slot_id = params[:slot_id]
    @competancename = params[:competance_name]
    user = params[:user]
    @firstname = user.first_name
    @lastname = user.last_name
    reviewer = params[:reviewer]
    @reviewername = ""
    @emails = ""
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    
    @reviewername = reviewer.first_name + " " + reviewer.last_name
    @emails = reviewer.email

    mail(to: @emails, subject: "[CDS system] Notify to review CDS assessment updates - competency #{@competancename}/slot #{@slot_id}")
  end
end
