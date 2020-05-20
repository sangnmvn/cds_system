class Comment < ApplicationRecord
    belongs_to :form_slot
    belongs_to :period
end
