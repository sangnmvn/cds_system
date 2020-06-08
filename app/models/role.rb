class Role < ApplicationRecord
  has_many :titles
  has_many :templates
  has_many :users
  has_many :forms
  belongs_to :user, :class_name => "User", foreign_key: "updated_by", optional: true
end
