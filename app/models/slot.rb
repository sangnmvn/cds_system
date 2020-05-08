class Slot < ApplicationRecord
    belongs_to :competency
    has_many :form_slots
    validates :desc, presence: {messege: "Please enter slot's description"}
    validates :evidence, presence: {messege: "Please enter slot's description"}
end
