class Period < ApplicationRecord
  has_many :forms
  has_many :schedules, dependent: :destroy
  has_many :title_histories
  has_many :summary_comments
  def format_name
    return "New" if from_date.nil? || to_date.nil?
    from_date.strftime("%m/%Y") + " - " + to_date.strftime("%m/%Y")
  end

  def format_name_tail
    return "New" if from_date.nil? || to_date.nil?
    to_date.strftime("%m/%Y")
  end

  def format_long_date
    "#{from_date.strftime("%b %d, %Y")} - #{to_date.strftime("%b %d, %Y")}"
  end

  def format_excel_name
    "#{from_date.strftime("%Y%m%d")}"
  end
end
