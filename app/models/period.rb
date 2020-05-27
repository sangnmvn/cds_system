class Period < ApplicationRecord
  has_many :forms
  has_one :schedule
  has_many :title_histories

  def format_name
    "New" if from_date.nil? || to_date.nil?
    from_date.strftime("%m/%Y") + " - " + to_date.strftime("%m/%Y")
  end
end
