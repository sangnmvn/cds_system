class Period < ApplicationRecord
  has_many :forms
  has_one :schedule
  validates :status, inclusion: { in: ["New", "Awaiting Review", "Awaiting Approval", "Pending", "Done"] }
end
