class Template < ApplicationRecord
    has_many :competencies
    belongs_to :role
end
