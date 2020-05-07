class Competency < ApplicationRecord
  has_many :slots
  has_many :title_competency_mappings
  belongs_to :template
  validates :name, :_type, presence: true
  validates :name, length: { in: 2..200 }
  validates_format_of :name, :with => /\A[a-zA-Z0-9]*\z/, :on => :create
  validates :_type, inclusion: { in: %w(General Specialized) }
end
