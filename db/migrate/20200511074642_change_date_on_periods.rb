class ChangeDateOnPeriods < ActiveRecord::Migration[6.0]
  def up
    change_column :periods, :from_date, :date
    change_column :periods, :to_date, :date
  end
  
  def down
    change_column :periods, :from_date, :datetime
    change_column :periods, :to_date, :datetime
  end  
end
