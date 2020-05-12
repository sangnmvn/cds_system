class Form < ApplicationRecord
    belongs_to :periods, optional: true
    belongs_to :admin_user
    has_many :form_slots
    has_many :form_histories
end
