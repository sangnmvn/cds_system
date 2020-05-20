class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  belongs_to :role
  has_many :project_members, :dependent => :destroy
  belongs_to :company
  has_many :forms, :dependent => :destroy
  has_many :user_group, :dependent => :destroy

  has_many :approvers, :class_name => "Approver", :foreign_key => "approver_id", :dependent => :destroy
  has_many :approvees, :class_name => "Approver", :foreign_key => "user_id", :dependent => :destroy

  scope :search_user, ->(search) {
          where("email LIKE :search OR first_name LIKE :search OR last_name LIKE :search", search: "%#{search}%") if search.present?
        }
end
