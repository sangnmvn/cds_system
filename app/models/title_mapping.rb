class TitleMapping < ApplicationRecord
  belongs_to :user, foreign_key: "updated_by", optional: true
  belongs_to :title, optional: true
  belongs_to :competency

  def string_value
    ApplicationController.helpers.convert_value_title_mapping value
  end
end
