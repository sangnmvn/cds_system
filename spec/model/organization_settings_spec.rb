require "rails_helper"

RSpec.describe Company, type: :model do
  describe Company do
    it "should validate_presence_of project" do
      project = Project.new(:desc => "project")
      project.should_not be_valid
    end
    it "should validate_presence_of role" do
      role = Role.new(:desc => "role")
      role.should_not be_valid
    end
    it "should validate_presence_of title" do
      title = Title.new(:desc => "title")
      title.should_not be_valid
    end
  end
end
