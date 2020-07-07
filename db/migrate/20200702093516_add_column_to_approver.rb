class AddColumnToApprover < ActiveRecord::Migration[6.0]
  def change
    add_column :approvers, :is_approver, :boolean, default: false
  end
end
