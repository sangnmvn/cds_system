class AddPeriodToApprover < ActiveRecord::Migration[6.0]
  def change
    add_reference :approvers, :period, foreign_key: true
  end
end
