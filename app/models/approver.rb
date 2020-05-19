class Approver < ApplicationRecord
  # has_many :project_members
  # has_many :projects, through: :project_members
  belongs_to :user, :class_name => "User"
  belongs_to :approver, :class_name => "User"
end
