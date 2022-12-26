class CreateSyncLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :sync_logs do |t|
      t.string :table_name
      t.integer :id_row
    end
  end
end
