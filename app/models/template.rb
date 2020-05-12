class Template < ApplicationRecord
  has_many :competencies, dependent: :destroy
  belongs_to :role
  belongs_to :admin_user
  validates :name, length: {maximum: 30, too_long: "The template name must be from 1 to 100 characters."}, uniqueness: {message: "The template name already exists."}
  validates :role, uniqueness: {message: "Role already exists."}
  validates :description, length: {maximum: 250, message: "The template name must be from 1 to 250 characters."}
end
