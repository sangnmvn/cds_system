class Privilege < ApplicationRecord
  belongs_to :title_privilege
  has_many :group_privilege
end
