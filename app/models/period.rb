class Period < ApplicationRecord
  has_many :forms
  has_many :schedules, dependent: :destroy
  has_many :title_histories
  has_many :summary_comments
  def format_name
    return "New" if from_date.nil? || to_date.nil?
    from_date.strftime("%m/%Y") + " - " + to_date.strftime("%m/%Y")
  end

  def format_to_date
    return "New" if to_date.nil?
    to_date.strftime("%m/%Y")
  end

  def format_long_date
    return "New" if from_date.nil? || to_date.nil?
    "#{from_date.strftime("%b %d, %Y")} - #{to_date.strftime("%b %d, %Y")}"
  end

  def format_excel_name
    return "New" if from_date.nil?
    from_date.strftime("%Y%m%d")
  end
end
