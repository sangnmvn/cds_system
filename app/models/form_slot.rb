class FormSlot < ApplicationRecord
    belongs_to :slot
    belongs_to :form
    has_many :comments
    has_many :form_slot_trackings
end
