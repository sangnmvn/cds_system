class ProjectMember < ApplicationRecord
  # belongs_to :approver
  belongs_to :user
  belongs_to :project

  # write logs for sync_logs_table
  after_commit on: [:create, :update, :destroy] do |project_member|
    write_log('project_members', project_member.id)
  end
end
