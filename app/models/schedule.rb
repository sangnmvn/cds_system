class Schedule < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :project, optional: true
  belongs_to :company, optional: true
  belongs_to :period, optional: true

  delegate :first_name, :last_name, :email, to: :user

  paginates_per 20
  max_paginates_per 20

  def sample
    Schedule.create!(user_id: 3, status: "New")
  end
end
