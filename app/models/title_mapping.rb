class TitleMapping < ApplicationRecord
  belongs_to :user, foreign_key: "updated_by"
  belongs_to :title
end
