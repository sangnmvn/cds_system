class AddAllowNullReviewerToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :allow_null_reviewer, :boolean, :default => false
  end
end
