class TitleMapping < ApplicationRecord
  belongs_to :user, foreign_key: "updated_by", optional: true
  belongs_to :title, optional: true
  belongs_to :competency
  validates_numericality_of :value, only_integer: true, greater_than_or_equal_to: 0

  def string_value
    ApplicationController.helpers.convert_value_title_mapping value
  end
end
