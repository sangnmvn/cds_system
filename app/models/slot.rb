class Slot < ApplicationRecord
  belongs_to :competency
  has_many :form_slot_histories
  has_many :form_slots
  validates :desc, presence: { messege: "Please enter slot's description" }
  validates :level, presence: { messege: "Please enter slot's level" }, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
  validates :competency_id, presence: { messege: "Please enter slot's competency id" }
  validates :slot_id, presence: { messege: "Please enter slot id" }, numericality: { only_integer: true, greater_than_or_equal_to: 1 }
  scope :search_slots, ->(search) {
          where("slots.desc LIKE ? or slots.level = ?", "%#{search}%", search.to_i) if search.present?
        }
end
