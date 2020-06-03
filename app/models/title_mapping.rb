class TitleMapping < ApplicationRecord
  belongs_to :user, foreign_key: "updated_by", optional: true
  belongs_to :title, optional: true
end
