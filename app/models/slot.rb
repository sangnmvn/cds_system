class Slot < ApplicationRecord
    belongs_to :competency
    has_many :form_slots
    validates :desc, presence: {messege: "Please enter slot's description"}
    validates :level, presence: {messege: "Please enter slot's level"}
    validates :competency_id, presence: {messege: "Please enter slot's competency id"}
    validates :slot_id, presence: {messege: "Please enter slot id"}
end
