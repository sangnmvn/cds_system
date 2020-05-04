class UserGroup < ApplicationRecord
  belongs_to :group
  belongs_to :admin_user
end
