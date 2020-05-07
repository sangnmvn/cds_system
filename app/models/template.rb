class Template < ApplicationRecord
  has_many :competencies
  belongs_to :role
  belongs_to :admin_user
  validates :name, length: {maximum: 30}, presence: {messege: "Please enter template name"}, uniqueness: true
  validates :desc, length: {maximum: 200}
end
