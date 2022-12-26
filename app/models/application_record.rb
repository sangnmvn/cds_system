class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def write_log(table_name, id_row)
    temp_data = SyncLog.find_by(table_name: table_name, id_row: id_row)
    SyncLog.create(table_name: table_name, id_row: id_row) if temp_data.nil?
  end
end
