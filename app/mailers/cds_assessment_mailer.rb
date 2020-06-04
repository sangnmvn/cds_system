class CdsAssessmentMailer < ApplicationMailer
  # default from: "hr@bestarion.com"
  def user_submit
    user = params[:user]
    @firstname = user.first_name
    @firstcharacters = user.last_name.split(" ").map { |x| x.chr }.join
    reviewers = params[:reviewer]
    @reviewer_name = ""
    @emails = ""
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    reviewers.each_with_index do |reviewer, index|
      @reviewer_name += reviewer.approver.first_name + reviewer.approver.last_name.split(" ").map { |x| x.chr }.join + ", "
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
    @competency_name = params[:competance_name]
    user = params[:user]
    @firstname = user.first_name
    @lastname = user.last_name.split(" ").map { |x| x.chr }.join
    reviewer = params[:reviewer]
    @reviewer_name = ""
    @emails = ""
    @from_date = params[:from_date]
    @to_date = params[:to_date]

    @reviewer_name = reviewer.first_name + reviewer.last_name.split(" ").map { |x| x.chr }.join
    @emails = reviewer.email

    mail(to: @emails, subject: "[CDS system] Notify to review CDS assessment updates - competency #{@competency_name}/slot #{@slot_id}")
  end

  def reviewer_requested_more_evidences
    CdsAssessmentMailer.with(slot_id: params[:slot_id], competance_name: params[:competance_name], staff: current_user, from_date: period.from_date, to_date: period.to_date).reviewer_requested_more_evidences.deliver_now

    @slot_id = params[:slot_id]
    @competency_name = params[:competance_name]
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Request to update your CDS assessment – competency #{@competency_name}/slot #{@slot_id}")
  end

  def reviewer_cancelled_request_more_evidences
    CdsAssessmentMailer.with(slot_id: params[:slot_id], competance_name: params[:competance_name], staff: current_user, recommend: recommend).reviewer_cancelled_request_more_evidences.deliver_now

    @slot_id = params[:slot_id]
    @competency_name = params[:competance_name]
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @recommend = params[:recommend]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Cancel the request to update your CDS assessment – competency #{@competency_name}/slot #{@slot_id}")
  end
end
