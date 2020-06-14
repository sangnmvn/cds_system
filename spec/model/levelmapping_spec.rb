require 'rails_helper'

RSpec.describe LevelMapping, type: :model do
  #-------------------- done -------------------------------------
  describe LevelMapping do
    it "should validate_presence_of" do
      action = LevelMapping.new(level: nil, rank_number: 2, quantity: 3,competency_type: 1)
      expect(action).to_not be_valid
    end
    it "should validate_presence_of" do
      action = LevelMapping.new(level: 1, rank_number: nil, quantity: 3,competency_type: 1)
      expect(action).to_not be_valid
    end
    it "should validate_presence_of" do
      action = LevelMapping.new(level: 1, rank_number: 2, quantity: nil,competency_type: 1)
      expect(action).to_not be_valid
    end
    it "should validate_presence_of" do
      action = LevelMapping.new(level: 1, rank_number: 2, quantity: 3,competency_type: nil)
      expect(action).to_not be_valid
    end
    it "is valid with valid attributes" do
      subject = LevelMapping.new(level: 1, rank_number: 2, quantity: 3,competency_type: 1)
      expect(subject).to be_valid
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
