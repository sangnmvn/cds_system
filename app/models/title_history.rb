class TitleHistory < ApplicationRecord
  belongs_to :period
  has_many :form_slot_histories, dependent: :destroy
end
