class Period < ApplicationRecord
    belongs_to :form
    has_many :comments
    has_many :form_slot_trackings
end
