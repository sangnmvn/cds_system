class Title < ApplicationRecord
    belongs_to :role, optional: true
    has_many :title_competency_mappings
    has_many :forms
end
