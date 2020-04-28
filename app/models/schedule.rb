class Schedule < ApplicationRecord
  belongs_to :admin_user
  belongs_to :project
end
