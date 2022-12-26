class Role < ApplicationRecord
  has_many :titles
  has_many :templates
  has_many :users
  has_many :forms
  belongs_to :user, :class_name => "User", foreign_key: "updated_by", optional: true
  validates :name, presence: { message: "Please enter a role name" }, uniqueness: { message: "Name already exsit" }
  
  # write logs for sync_logs_table
  after_commit on: [:create, :update, :destroy] do |role|
    write_log('roles', role.id)
  end
end
