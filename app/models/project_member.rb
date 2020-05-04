class ProjectMember < ApplicationRecord
    # belongs_to :approver
    belongs_to :admin_user
    belongs_to :project
end
