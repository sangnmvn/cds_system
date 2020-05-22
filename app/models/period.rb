class Period < ApplicationRecord
    has_many :forms
    has_one  :schedule
    has_many :comments
    has_many :line_managers
end
