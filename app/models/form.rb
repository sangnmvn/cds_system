class Form < ApplicationRecord
  belongs_to :period, optional: true
  belongs_to :period_keep, class_name: "Period", optional: true
  belongs_to :user
  has_many :form_slots, dependent: :destroy
  belongs_to :template
  belongs_to :role, optional: true
  belongs_to :title, optional: true
  has_many :form_histories
  has_many :summary_comments
  # validates_numericality_of :level, only_integer: true, greater_than_or_equal_to: 1
  # validates_numericality_of :rank, only_integer: true, greater_than_or_equal_to: 1
  validates :status, inclusion: { in: ["New", "Awaiting Review", "Awaiting Approval", "Done"] }
end
