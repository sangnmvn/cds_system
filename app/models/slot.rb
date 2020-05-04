class Slot < ApplicationRecord
    belongs_to :competency
    has_many :form_slots
end
