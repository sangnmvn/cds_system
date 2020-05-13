class ChangeSchedules < ActiveRecord::Migration[6.0]
  def change
    change_table :schedules do |t|
      t.change :start_date, :date
      t.change :end_date, :date
      t.references :company
      t.column :desc, :text
      t.column :status, :string
      t.column :end_date_reviewer, :date
      t.column :notify_reviewer, :string
      t.rename(:notify_date, :notify_employee)
      t.rename(:end_date, :end_date_employee)
    end
  end
end
