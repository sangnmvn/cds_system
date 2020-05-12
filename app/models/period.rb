class Period < ApplicationRecord
    has_many :forms
    has_one  :schedule
    has_many :comments
    has_many :form_slot_trackings
end
