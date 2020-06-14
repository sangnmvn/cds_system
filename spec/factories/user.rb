FactoryGirl.define do
  factory :user do
    first_name    { Faker::Name.first_name }
    last_name    { Faker::Name.last_name }
    email       { Faker::Internet.email }
    role_id {Faker::IDNumber.role_id}
  end
end