require 'rails_helper'

RSpec.describe LevelMapping, type: :model do
  describe LevelMapping do
    it { should validate_presence_of :level }
    it { should validate_presence_of :quantity }
    it { should validate_presence_of :rank_number }
    it { should validate_presence_of :competency_type }
  end
  describe "numericality_level" do
    it { should validate_numericality_of(:level).only_integer }
    it { should validate_numericality_of(:level).is_greater_than_or_equal_to(1) }
  end
  describe "numericality_quantity" do
    it { should validate_numericality_of(:quantity).only_integer }
    it { should validate_numericality_of(:quantity).is_greater_than_or_equal_to(1) }
  end
  describe "numericality_rank_number" do
    it { should validate_numericality_of(:rank_number).only_integer }
    it { should validate_numericality_of(:rank_number).is_greater_than_or_equal_to(1) }
  end
  describe "associations_title" do
    it { should belong_to(:title) }
  end
  describe "associations_user" do
    it { should belong_to(:user) }
  end
end
