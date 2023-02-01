class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def write_log(table_name, id_row)
    temp_data = SyncLog.find_by(table_name: table_name, id_row: id_row)
    if temp_data.nil?
      SyncLog.create(table_name: table_name, id_row: id_row)
    else
      temp_data.updated_at = Time.now
      temp_data.save
    end
  end
end
