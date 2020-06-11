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
    @competency_name = params[:competency_name]
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
    @slot_id = params[:slot_id]
    @competency_name = params[:competency_name]
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Request to update your CDS assessment – competency #{@competency_name}/slot #{@slot_id}")
  end

  def reviewer_cancelled_request_more_evidences
    @slot_id = params[:slot_id]
    @competency_name = params[:competency_name]
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @recommend = params[:recommend]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Cancel the request to update your CDS assessment – competency #{@competency_name}/slot #{@slot_id}")
  end

  def email_to_pm
    pm = params[:pm]
    @pm_name = pm.first_name + pm.last_name.split(" ").map { |x| x.chr }.join
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @emails = pm.email

    mail(to: @emails, subject: "[CDS system] Notify to approve CDS for#{@staff_name}")
  end

  def pm_approve_cds
    @rank_number = params[:rank_number]
    @level_number = params[:level_number]
    @title_number = params[:title_number]
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Temporary CDS title in period [from #{@from_date} to #{@to_date}]")
  end

  def pm_re_approve_cds
    @rank_number = params[:rank_number]
    @level_number = params[:level_number]
    @title_number = params[:title_number]
    staff = params[:staff]
    @staff_name = staff.first_name + staff.last_name.split(" ").map { |x| x.chr }.join
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Temporary CDS title in period [from #{@from_date} to #{@to_date}] (update)")
  end
end
