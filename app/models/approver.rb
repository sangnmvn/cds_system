class Approver < ApplicationRecord
    # has_many :project_members
    # has_many :projects, through: :project_members
    belongs_to :admin_user
    
end
