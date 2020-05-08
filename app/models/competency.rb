class Competency < ApplicationRecord
  has_many :slots, dependent: :destroy
  has_many :title_competency_mappings
  belongs_to :template
  validates :name, :_type, presence: true
  validates :name, length: { in: 2..200 }
  # validates :name, format: { with: /\A[a-zA-Z0-9]+\z/ }
  validates :_type, inclusion: { in: %w(General Specialized) }
end
