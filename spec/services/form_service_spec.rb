require "rails_helper"
RSpec.describe Api::FormService, type: :request do
  FORM_NIL = 999
  ADMIN_ID = 1
  H_SLOT = { 1 => "1A", 2 => "1B", 3 => "1C", 4 => "1D", 5 => "1E", 6 => "2A", 7 => "2B", 8 => "2C", 9 => "3A", 10 => "3B", 11 => "3C" }
  COMPANIES = [{ :id => 3, :name => "Larion" }, { :id => 2, :name => "Bestarion" }, { :id => 4, :name => "Atalink" }]
  PROJECTS = [{ :id => 1, :name => "Mars" }, { :id => 15, :name => "CDS" }, { :id => 19, :name => "Blue Sky" }]
  ROLES = [{ :id => 1, :name => "Developer" },
           { :id => 2, :name => "Business Analyst" },
           { :id => 3, :name => "Quality Control" },
           { :id => 5, :name => "Scrum Master" },
           { :id => 6, :name => "DevOps" },
           { :id => 7, :name => "Operations Engineer" },
           { :id => 8, :name => "Medical Analyst" },
           { :id => 9, :name => "Technical Support" },
           { :id => 4, :name => "Project Manager" },
           { :id => 16, :name => "BOD" },
           { :id => 10, :name => "Human Resource" }]
  before(:all) do
    config = Rails.application.config.database_configuration["test"]
    ActiveRecord::Base.establish_connection(config)
    User.connection
    @form_service ||= Api::FormService.new(form_params, current_user)
  end

  def current_user
    User.find_by_id(ADMIN_ID)
  end

  def form_params
    {
      form_id: 1, template_id: 1,
      competency_id: 1, level: 1,
      user_id: 1, is_commit: true,
      point: 3, evidence: "test",
      given_point: 3, recommend: "test",
      search: "test", filter: "test",
      slot_id: 1, period_id: 1,
      title_history_id: nil, form_slot_id: [1],
      competency_name: "test", offset: 20,
      user_ids: [1], company_ids: [1],
      project_ids: [1], period_ids: [1],
      role_ids: [1], type: "excel",
      cancel_slots: nil, summary_id: 1,
      comment: "test", ext: "xlsx",
    }
  end

  it "get_slot_change" do
    @form_service.get_slot_change.should be_blank
  end

  it "get_competencies" do
    @form_service.get_competencies(FORM_NIL).should eql(false)
  end

  it "get_competencies_reviewer" do
    @form_service.get_competencies_reviewer(FORM_NIL).should eql(false)
  end

  it "get_summary_comment" do
    @form_service.get_summary_comment.should be_blank
  end

  it "save_summary_comment" do
    @form_service.save_summary_comment.should eql(false)
  end

  it "get_location_slot" do
    @form_service.get_location_slot(1).should eql(H_SLOT)
  end

  it "get_old_competencies" do
    @form_service.get_old_competencies.should be_blank
  end

  it "reset_all_approver_submit_status" do
    @form_service.reset_all_approver_submit_status(1).should eql(true)
  end

  it "get_list_cds_review" do
    @form_service.get_list_cds_review.should be_blank
  end

  it "get_list_cds_review_to_export" do
    data = @form_service.get_list_cds_review_to_export

    data[:data].should be_blank
  end

  it "data_filter_cds_review" do
    @form_service.data_filter_cds_review.should eql({ :companies => [], :projects => [], :roles => [], :users => [], :periods => [] })
  end

  it "get_line_manager_miss_list" do
    @form_service.get_line_manager_miss_list.should be_blank
  end

  it "data_filter_cds_approve" do
    @form_service.data_filter_cds_approve.should eql({ :companies => [], :projects => [], :roles => [], :users => [], :periods => [] })
  end

  it "get_list_cds_assessment" do
    @form_service.get_list_cds_assessment.should be_blank
  end

  it "format_data_slots" do
    @form_service.format_data_slots.should be_blank
  end

  it "format_data_old_slots" do
    @form_service.format_data_old_slots.should be_blank
  end

  it "unchange_slot" do
    @form_service.unchange_slot.should be_blank
  end

  it "save_cds_staff" do
    @form_service.save_cds_staff.should eql(false)
  end

  it "get_assessment_staff" do
    @form_service.get_assessment_staff.should be_blank
  end

  it "save_add_more_evidence" do
    @form_service.save_add_more_evidence.should eql(false)
  end

  it "request_add_more_evidence" do
    @form_service.request_add_more_evidence.should eql(false)
  end

  it "save_cds_manager" do
    @form_service.save_cds_manager.should be_blank
  end

  it "preview_result" do
    @form_service.preview_result.should eql(false)
  end

  it "data_view_result" do
    @form_service.data_view_result.should eql(false)
  end

  it "calculate_result" do
    form = Form.first
    competencies = Competency.where(template_id: form&.template_id)
    result = @form_service.preview_result(form)
    @form_service.calculate_result(form, competencies, result).should eql(false)
  end

  it "calculate_result_by_type" do
    form = Form.first
    competencies = Competency.where(template_id: form&.template_id)
    result = @form_service.preview_result(form)
    @form_service.calculate_result_by_type(form, competencies, result).should eql(false)
  end

  it "calculate_level" do
    @form_service.calculate_level({}).should eql("0")
  end

  it "approve_cds" do
    @form_service.approve_cds.should eql("fail")
  end

  it "withdraw_cds" do
    @form_service.withdraw_cds.should eql("fail")
  end

  it "reject_cds" do
    @form_service.reject_cds.should eql("fail")
  end

  it "get_data_view_history" do
    @form_service.get_data_view_history.should be_blank
  end

  it "get_data_form_slot" do
    @form_service.get_data_form_slot.should be_blank
  end

  it "get_conflict_assessment" do
    @form_service.get_conflict_assessment.should be_blank
  end

  it "request_update_cds" do
    @form_service.request_update_cds(form_params[:form_slot_id], form_params[:slot_id]).should eql(false)
  end

  it "cancel_request" do
    @form_service.cancel_request(form_params[:form_slot_id], form_params[:slot_id]).should eql(false)
  end

  it "load_form_cds_staff" do
    @form_service.load_form_cds_staff.should eql("fails")
  end

  it "create_form_slot" do
    @form_service.create_form_slot.should eql(0)
  end
end
