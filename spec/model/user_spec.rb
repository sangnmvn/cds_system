require "rails_helper"

RSpec.describe User, type: :model do
  it { should validate_uniqueness_of(:account) }
  it { should validate_presence_of(:account) }
  it { should validate_presence_of(:email) }
  it { should validate_presence_of(:first_name) }
  it { should validate_presence_of(:last_name) }
  it { should validate_presence_of(:gender) }
  it { should belong_to(:company) }
  it { should belong_to(:role).optional }
  it { should belong_to(:title).optional }
end
