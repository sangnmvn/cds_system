class FormSlotHistory < ApplicationRecord
  belongs_to :title_history
  belongs_to :slot
end
