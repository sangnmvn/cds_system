class Company < ApplicationRecord
  has_many :users
  has_many :projects

  has_many :subordinates, class_name: "Company",
                          foreign_key: "parent_company_id"

  belongs_to :parent_company, class_name: "Company", optional: true
end
