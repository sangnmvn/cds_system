class TitleHistory < ApplicationRecord
  belongs_to :period
  belongs_to :user
  has_many :form_slot_histories, dependent: :destroy
end
