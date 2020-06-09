require 'rails_helper'

RSpec.describe LevelMapping, type: :model do
  describe LevelMapping do
    it { is_expected.to validate_presence_of(:level) }
    it { is_expected.to validate_presence_of(:quantity) }
    it { is_expected.to validate_presence_of(:rank_number) }
    it { is_expected.to validate_presence_of(:competency_type) }
  end
  describe "associations_title" do
    it { should belong_to(:title) }
  end
  describe "associations_user" do
    it { should belong_to(:user) }
  end
end
