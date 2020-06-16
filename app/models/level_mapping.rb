class LevelMapping < ApplicationRecord
  belongs_to :user, foreign_key: "updated_by", optional: true
  belongs_to :title, optional: true
  validates_numericality_of :level, only_integer: true, greater_than_or_equal_to: 1
  validates_numericality_of :quantity, only_integer: true, greater_than_or_equal_to: 1
  validates_numericality_of :rank_number, only_integer: true, greater_than_or_equal_to: 1
  validates :competency_type, presence: true
end
