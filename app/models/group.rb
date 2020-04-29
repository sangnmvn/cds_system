class Group < ApplicationRecord
  has_many :group_privilege
  has_many :user_group
end
