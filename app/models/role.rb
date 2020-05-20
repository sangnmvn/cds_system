class Role < ApplicationRecord
  has_many :titles
  has_many :templates
  has_many :users
end
