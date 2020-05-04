class Form < ApplicationRecord
    belongs_to :admin_user
    has_many :form_slots
    has_many :periods
    has_many :form_histories
end
