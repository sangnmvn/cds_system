class Period < ApplicationRecord
  has_many :forms
  has_many :schedules, :dependent => :destroy
  has_many :comments
  has_many :form_slot_trackings
end
