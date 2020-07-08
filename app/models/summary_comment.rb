class SummaryComment < ApplicationRecord
  belongs_to :user,  foreign_key: "line_manager_id", optional: true
  belongs_to :period, optional: true
  belongs_to :form, optional: true
end