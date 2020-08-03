require "rails_helper"

RSpec.describe Form, type: :model do
  describe Form do
    it "should validate_enum_of status" do
      action = Form.new(_type: "", is_approved: 1, template_id: 1, period_id: 50, role_id: 1, status: "abc")
      expect(action).to_not be_valid
    end
    it "is valid with valid status" do
      action = Form.new(_type: "", is_approved: 1, template_id: 1, period_id: 50, role_id: 1, status: "New")
      expect(action).to_not be_valid
    end
  end
end