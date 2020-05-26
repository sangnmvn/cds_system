class Form < ApplicationRecord
  belongs_to :period, optional: true
  belongs_to :user
  has_many :form_slots, dependent: :destroy
  belongs_to :template
  belongs_to :role, optional: true
  belongs_to :title, optional: true
  has_many :form_histories
end
