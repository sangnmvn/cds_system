class Schedule < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :project, optional: true
  belongs_to :company, optional: true
  belongs_to :period, optional: true

  delegate :first_name, :last_name, :email, to: :user

  scope :search_schedule, ->(search) {
          where("`desc` LIKE :search OR companies.name LIKE :search", search: "%#{search}%") if search.present?
        }

  def sample
    Schedule.create!(user_id: 3, status: "New")
  end
end
