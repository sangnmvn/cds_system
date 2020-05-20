class Project < ApplicationRecord
  belongs_to :company
  has_many :project_members
  has_many :approvers, through: :project_members
end
