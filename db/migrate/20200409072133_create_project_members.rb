class CreateProjectMembers < ActiveRecord::Migration[6.0]
  def change
    create_table :project_members do |t|
      t.belongs_to :user
      # t.belongs_to :approver
      t.belongs_to :project
      t.boolean :is_managent
      t.timestamps
    end
  end
end
