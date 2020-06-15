class LevelMapping < ApplicationRecord
  belongs_to :user, foreign_key: "updated_by", optional: true
  belongs_to :title, optional: true
  validates :level, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :rank_number, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :competency_type, presence: true
end
