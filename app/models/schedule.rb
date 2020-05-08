class Schedule < ApplicationRecord
  belongs_to :admin_user, optional: true
  belongs_to :project, optional: true
  belongs_to :company, optional: true

  delegate :first_name, :last_name, :email, to: :admin_user
  
  paginates_per 20
  max_paginates_per 20

  def sample
    Schedule.create!(admin_user_id: 3,status: 'New')
  end
end
