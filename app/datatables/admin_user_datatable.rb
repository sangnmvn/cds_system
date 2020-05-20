class AdminUserDatatable < AjaxDatatablesRails::ActiveRecord

  def view_columns
    # Declare strings in this format: ModelName.column_name
    # or in aliased_join_table.column_name format
    @view_columns ||= {
      id: { source: "User.id", cond: :eq },
      first_name: { source: "User.first_name", cond: :like }
      last_name:  { source: "User.last_name", cond: :like }
      email:  { source: "User.email", cond: :like }
      account:  { source: "User.account", cond: :like }
      
      role:  { source: "User.Role.name", cond: :like }
      title:  { source: "User.account", cond: :like }
      project:  { source: "User.account", cond: :like }
      company:  { source: "User.account", cond: :like }
      action:  { source: "User.account", cond: :like }

    }
  end

  def data
    records.map do |record|
      {
        # example:
        id: record.id,
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
        account: record.account,
        role: Role.find(record.role_id),
        title: record.id, # title reserved
        project: record.id, # project reserved
        company: record.id, # company reserved
        action: record.id, # action reserved

      }
    end
  end

  def get_raw_records
    # insert query here
    User.all
  end

end
