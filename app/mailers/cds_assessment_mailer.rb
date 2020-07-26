class CdsAssessmentMailer < ApplicationMailer
  # default from: "hr@bestarion.com"
  def user_submit
    user = params[:user]
    @name = user.account
    @fullname = "#{user.first_name} #{user.last_name}"
    approvers = params[:approvers]
    @action = params[:action]
    @reviewer_name = ""
    @emails = ""
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    approvers.each_with_index do |approver, index|
      @reviewer_name += approver.account + ", "
      if index == 0
        @emails += approver.email
      else
        @emails += ", " + approver.email
      end
    end
    mail(to: @emails, subject: "[CDS system] CDS/CDP Assessment Request to #{@action} CDS assessment for #{@name}")
  end

  def user_add_more_evidence
    @name = params[:user_name]
    @reviewer_names = params[:reviewers].map(&:first).join(", ")
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @slots = params[:slots]
    @current_user = params[:current_user]
    @emails = ""
    params[:reviewers].each do |reviewer|
      if @emails == ""
        @emails += reviewer.last
      else
        @emails += ", " + reviewer.last
      end
    end
    mail(to: @emails, subject: "[CDS system] Notify to review CDS/CDP assessment updates for #{@name}")
  end

  def reviewer_request_update
    @name = params[:staff].account
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @slots = params[:slots]
    mail(to: params[:staff].email, subject: "[CDS system] Request to update your CDS/CDP assessment")
  end

  def reviewer_cancel_request_update
    @name = params[:staff].account
    @slots = params[:slots]
    mail(to: params[:staff].email, subject: "[CDS system] Cancel the request to update your CDS/CDP assessment")
  end

  def reviewer_requested_more_evidences
    @slot_id = params[:slot_id]
    @competency_name = params[:competency_name]
    staff = params[:staff]
    @staff_name = staff.account
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = staff.email
    mail(to: @emails, subject: "[CDS system] Request to update your CDS assessment – competency #{@competency_name}/slot #{@slot_id}")
  end

  def staff_withdraw_CDS_CDP
    @account = params[:account]
    @name = params[:user_name]
    @reviewer_names = params[:reviewers].map(&:first).join(", ")
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = ""
    params[:reviewers].each do |reviewer|
      if @emails == ""
        @emails += reviewer.last
      else
        @emails += ", " + reviewer.last
      end
    end
    mail(to: @emails, subject: "[CDS system] Withdraw CDS/CDP assessment of #{@account}")
  end

  def reviewer_cancelled_request_more_evidences
    @slot_id = params[:slot_id]
    @competency_name = params[:competency_name]
    staff = params[:staff]
    @staff_name = staff.account
    @recommend = params[:recommend]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Cancel the request to update your CDS assessment – competency #{@competency_name}/slot #{@slot_id}")
  end

  def email_to_pm
    pm = params[:pm]
    @pm_name = pm.account
    staff = params[:staff]
    @staff_name = staff.account
    @emails = pm.email
    mail(to: @emails, subject: "[CDS system] Notify to approve CDS for #{@staff_name}")
  end

  def pm_approve_cds
    @rank_number = params[:rank_number]
    @level_number = params[:level_number]
    @title_number = params[:title_number]
    staff = params[:staff]
    @staff_name = staff.account
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
    @staff_name = staff.account
    @from_date = params[:from_date]
    @to_date = params[:to_date]
    @emails = staff.email

    mail(to: @emails, subject: "[CDS system] Temporary CDS title in period [from #{@from_date} to #{@to_date}] (update)")
  end
end
