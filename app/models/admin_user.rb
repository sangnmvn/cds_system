class AdminUser < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  belongs_to :role
  has_many :project_members
  belongs_to :company
  devise :database_authenticatable,
         :recoverable, :rememberable, :validatable
  has_many :forms
end
