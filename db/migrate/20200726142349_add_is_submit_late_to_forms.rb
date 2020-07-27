class AddIsSubmitLateToForms < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :is_submit_late, :boolean, default: false
  end
end
