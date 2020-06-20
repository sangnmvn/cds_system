class Title < ApplicationRecord
  belongs_to :role, optional: true
  has_many :level_mappings
  has_many :title_mappings
  has_many :title_competency_mappings
  has_many :forms
  has_many :users
end
