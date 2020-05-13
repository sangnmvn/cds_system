class Template < ApplicationRecord
  has_many :competencies, dependent: :destroy
  belongs_to :role
  belongs_to :admin_user
  validates :name, presence: { message: "Please enter a template name" }, length: { within: 2..100, too_short: "The template name must be from 2 to 100 characters.", too_long: "The template name must be from 2 to 100 characters." }, uniqueness: { message: "The template name already exists." }
  validates :role, presence: { message: "Please select a role" }, uniqueness: { message: "Role already exists." }
  validates :description, length: { maximum: 250, too_long: "The maximum description must be 250 characters." }
end
