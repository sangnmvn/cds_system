class AddPeriodToApprover < ActiveRecord::Migration[6.0]
  def change
    add_reference :approvers, :period, null: false, default: 1, foreign_key: true
  end
end
