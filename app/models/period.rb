class Period < ApplicationRecord
  has_many :forms
  has_many :schedules, dependent: :destroy
  has_many :title_histories

  def format_name
    return "New" if from_date.nil? || to_date.nil?
    from_date.strftime("%m/%Y") + " - " + to_date.strftime("%m/%Y")
  end

  def format_long_date
    "#{from_date.strftime("%b %d, %Y")} - #{to_date.strftime("%b %d, %Y")}"
  end
end
