class Group < ApplicationRecord
  has_many :group_privilege
  has_many :user_group

  def list_privileges
    self.privileges.split(",").map(&:to_i)
  end
end
