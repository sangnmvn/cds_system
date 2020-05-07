class Schedule < ApplicationRecord
  belongs_to :admin_user
  belongs_to :project

  delegate :first_name, :last_name, :email, to: :admin_user
  delegate :desc, to: :project
  paginates_per 20
  max_paginates_per 20
end
