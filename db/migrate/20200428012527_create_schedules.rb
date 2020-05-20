class CreateSchedules < ActiveRecord::Migration[6.0]
  def change
    create_table :schedules do |t|
      t.references :user, null: false, foreign_key: true
      t.references :project, null: true, foreign_key: true
      t.references :company, null: true, foreign_key: true
      t.references :period, null: true, foreign_key: true
      t.date :start_date
      t.date :end_date_reviewer
      t.date :end_date_employee
      t.date :end_date_hr
      t.integer :notify_reviewer
      t.integer :notify_employee
      t.integer :notify_hr
      t.column :desc, :text
      t.column :status, :string

      t.timestamps
    end
  end
end
