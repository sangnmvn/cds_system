class Role < ApplicationRecord
  has_many :titles
  has_many :templates
  has_many :users
  has_many :forms
end
