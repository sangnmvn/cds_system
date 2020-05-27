class TitleHistory < ApplicationRecord
  belongs_to :period
  has_many :form_slot_histories
end
