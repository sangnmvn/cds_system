class Company < ApplicationRecord
  has_many :users
  has_many :projects
  has_many :subordinates, class_name: "Company",
                          foreign_key: "parent_company_id"

  belongs_to :parent_company, class_name: "Company", optional: true
  validates :name, presence: { message: "Please enter a company name" }, uniqueness: { message: "￼Name already exsit" }
  validate :phone_invalid

  def phone_invalid
    if !(phone&.match(/\d{1,12}/) || phone.blank?)
      errors.add(:phone, "Phone must be from 1 to 12 digits")
    end
  end

  def format_excel_name
    (abbreviation.nil? || abbreviation) ? name : abbreviation
  end
end
