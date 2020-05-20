class Title < ApplicationRecord
    belongs_to :role
    has_many :title_competency_mappings
end
