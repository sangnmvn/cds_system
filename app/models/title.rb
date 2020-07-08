class Title < ApplicationRecord
  belongs_to :role, optional: true
  has_many :level_mappings
  has_many :title_mappings
  has_many :title_competency_mappings
  has_many :forms
  has_many :users
  validates :name, presence: { message: "Please enter a title name" }, uniqueness: { message: "￼Name already exsit" }
end
