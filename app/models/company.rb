class Company < ApplicationRecord
  has_many :users
  has_many :projects
  has_many :subordinates, class_name: "Company",
                          foreign_key: "parent_company_id"

  belongs_to :parent_company, class_name: "Company", optional: true
  validates :name, presence: { message: "Please enter a company name" }, uniqueness: { message: "￼Name already exsit" }
  validate :phone_valid_or_blank

  def phone_valid_or_blank
    if !(phone.match(/\d{1,12}/) || phone.blank?)
      errors.add(:phone, "Phone phải từ 1 đến 12 ký tự và không được blank")
    end
  end

  def format_excel_name
    (abbreviation.nil? || abbreviation) ? name : abbreviation
  end
end
