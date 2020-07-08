class Project < ApplicationRecord
  belongs_to :company
  has_many :project_members
  has_many :approvers, through: :project_members
  validates :desc, presence: { message: "Please enter a project name" }
end
