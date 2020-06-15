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
  end

  #---------------------------------------------------------------
  # describe "numericality_level" do
  #   it { should validate_numericality_of(:level).only_integer }
  #   it { should validate_numericality_of(:level).is_greater_than_or_equal_to(1) }
  # end
  # describe "numericality_quantity" do
  #   it { should validate_numericality_of(:quantity).only_integer }
  #   it { should validate_numericality_of(:quantity).is_greater_than_or_equal_to(1) }
  # end
  # describe "numericality_rank_number" do
  #   it { should validate_numericality_of(:rank_number).only_integer }
  #   it { should validate_numericality_of(:rank_number).is_greater_than_or_equal_to(1) }
  # end
  # describe "associations_title" do
  #   it { should belong_to(:title) }
  # end
  # describe "associations_user" do
  #   it { should belong_to(:user) }
  # end
end
