class Competency < ApplicationRecord
  has_many :slots, dependent: :destroy
  has_many :title_competency_mappings
  has_many :title_mappings
  belongs_to :template
  validates :name, :_type, presence: true
  validates :name, length: { in: 2..100 }
  validates :desc, length: { in: 0..100 }
  validates :name, format: { with: /\A[\w\.,\s\&]+\z/ }
  validates :_type, inclusion: { in: %w(General Specialized) }

  def type
    self._type
  end

  def sort_type
    self._type == "General" ? "G" : "S"
  end
end
