class ScheduleDatatable < AjaxDatatablesRails::ActiveRecord

  def view_columns
    # Declare strings in this format: ModelName.column_name
    # or in aliased_join_table.column_name format
    # @view_columns ||= {
    #   id:         { source: "Schedule.id" },
    #   first_name: { source: "Sc.first_name", cond: :like, searchable: true, orderable: true },
    #   last_name:  { source: "User.last_name",  cond: :like },
    #   email:      { source: "User.email" },

    # }
  end

  def data
    records.map do |record|
      {
        # example:
        # id: record.id,
        # name: record.name
      }
    end
  end

  def get_raw_records
    # insert query here
    # User.all
    Schedule.all
  end

end
