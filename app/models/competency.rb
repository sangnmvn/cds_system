class Competency < ApplicationRecord
    has_many :slots
    has_many :title_competency_mappings
    belongs_to :template
end
