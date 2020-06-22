class AddIsCommitToLineManagers < ActiveRecord::Migration[6.0]
  def change
    add_column :line_managers, :is_commit, :boolean
  end
end
