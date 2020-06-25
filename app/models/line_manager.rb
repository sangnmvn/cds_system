class LineManager < ApplicationRecord
  belongs_to :form_slot
  belongs_to :period

  def format_updated_date
    self.updated_at ? self.updated_at.strftime("%b %d, %Y") : ""
  end
end
