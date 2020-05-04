class GroupPrivilege < ApplicationRecord
  belongs_to :group
  belongs_to :privilege
end
