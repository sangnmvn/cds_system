class AddReferencesToApprovers < ActiveRecord::Migration[6.0]
    def change
      add_column :approvers, :approver_id, :bigint
      add_foreign_key :approvers, :admin_users, column: :approver_id
    end
end