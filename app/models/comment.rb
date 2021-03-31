class Comment < ApplicationRecord
  belongs_to :form_slot
  validates :evidence, length: { maximum: 3000 }
end
