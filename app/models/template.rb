class Template < ApplicationRecord
  has_many :competencies, dependent: :destroy
  belongs_to :role
  belongs_to :admin_user
  validates :name, length: {maximum: 30}, presence: true, uniqueness: true
  validates :description, length: {maximum: 200}
end
