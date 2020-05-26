class Period < ApplicationRecord
  has_many :forms
  has_one :schedule
end
