class CreateApprovers < ActiveRecord::Migration[6.0]
  def change
    # done
    create_table :approvers do |t|
      t.belongs_to :user, foreign_key: true
      t.references :approver, references: :users

      t.timestamps
    end
  end
end
