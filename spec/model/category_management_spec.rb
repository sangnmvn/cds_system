require "rails_helper"

RSpec.describe Company, type: :model do
  describe Company do
    it "should validate_presence_of company" do
      Company.create!(:name => "company_testing")
      company = Company.new(:name => "company_testing")
      company.should_not be_valid
      company.errors[:name].should include("￼Name already exsit")
    end
  end
end
