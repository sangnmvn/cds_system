class ProjectMember < ApplicationRecord
  # belongs_to :approver
  belongs_to :user
  belongs_to :project
end
