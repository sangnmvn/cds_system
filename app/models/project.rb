class Project < ApplicationRecord
  belongs_to :company
  has_many :project_members
  has_many :approvers, through: :project_members

  # write logs for sync_logs_table
  after_commit on: [:create, :update, :destroy] do |project|
    write_log('projects', project.id)
  end
end
