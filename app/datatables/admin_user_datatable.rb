class AdminAdminUserDatatable < AjaxDatatablesRails::ActiveRecord

  def view_columns
    # Declare strings in this format: ModelName.column_name
    # or in aliased_join_table.column_name format
    @view_columns ||= {
      id: { source: "AdminUser.id", cond: :eq },
      first_name: { source: "AdminUser.first_name", cond: :like }
      last_name:  { source: "AdminUser.last_name", cond: :like }
      email:  { source: "AdminUser.email", cond: :like }
      account:  { source: "AdminUser.account", cond: :like }
      
      role:  { source: "AdminUser.Role.name", cond: :like }
      title:  { source: "AdminUser.account", cond: :like }
      project:  { source: "AdminUser.account", cond: :like }
      company:  { source: "AdminUser.account", cond: :like }
      action:  { source: "AdminUser.account", cond: :like }

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
    AdminUser.all
  end

end
