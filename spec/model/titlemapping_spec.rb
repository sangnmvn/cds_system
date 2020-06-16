require "rails_helper"

RSpec.describe TitleMapping, type: :model do
  #-------------------- done -------------------------------------
  describe TitleMapping do
    it "should validate_presence_of value" do
      action = TitleMapping.new(value: nil, updated_by: 1, title_id: 1, competency_id: 1)
      expect(action).to_not be_valid
    end

    it "should validate_presence_of updated_by" do
      action = TitleMapping.new(value: 1, updated_by: nil, title_id: 1, competency_id: 1)
      expect(action).to_not be_valid
    end

    it "should validate_presence_of title" do
      action = TitleMapping.new(value: 1, updated_by: 1, title_id: nil, competency_id: 1)
      expect(action).to_not be_valid
    end

    it "should validate_presence_of competency" do
      action = TitleMapping.new(value: 1, updated_by: 1, title_id: 1, competency_id: nil)
      expect(action).to_not be_valid
    end

    # it "is valid with valid attributes" do
    #   subject = TitleMapping.new(value: 1, updated_by: 1, title_id: 1, competency_id: nil)
    #   expect(subject).to be_valid
    # end
  end

  #---------------------------------------------------------------
  describe "numericality_value" do
    it { should validate_numericality_of(:value).only_integer.is_greater_than_or_equal_to(1)}
  end
end
