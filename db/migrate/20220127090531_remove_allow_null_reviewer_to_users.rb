class RemoveAllowNullReviewerToUsers < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :allow_null_reviewer, :boolean
  end
end
