class TitleCompetencyMapping < ApplicationRecord
    belongs_to :title
    belongs_to :competency
end
