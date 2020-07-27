class Period < ApplicationRecord
  has_many :forms
  has_many :forms, class_name: "Form", foreign_key: "period_keep_id"
  has_many :schedules, dependent: :destroy
  has_many :title_histories
  has_many :summary_comments
  validate :check_period_status

  def check_period_status
    errors.add(:from_date, "From date must be greater or equal to today") if from_date.midnight < Date.today.midnight
    errors.add(:to_date, "To date must be greater than from date") if to_date.midnight < from_date.midnight
  end

  def format_name
    return "New" if from_date.nil? || to_date.nil?
    from_date.strftime("%m/%Y") + " - " + to_date.strftime("%m/%Y")
  end

  def format_to_date
    return "New" if to_date.nil?
    to_date.strftime("%m/%Y")
  end

  def format_period_career
    return "New" if to_date.nil?
    to_date.strftime("%Y/%m/%d")
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
