class UserGroupDatatable < AjaxDatatablesRails::ActiveRecord
  extend Forwardable
  def_delegators :@view, :link_to, :link_to_if, :edit_schedule_path, :content_tag

  def initialize(params, opts = {})
    @view = opts[:view_context]
    super
  end

  def view_columns
    @view_columns ||= {
      id: { source: "User.id", searchable: false },
      first_name: { source: "User.first_name", searchable: false },
      last_name: { source: "User.last_name", searchable: false },
      email: { source: "User.email", searchable: false },
    }
  end

  private

  def data
    records.map do |record|
      {
        id: record.id,
        first_name: record.first_name,
        last_name: record.last_name,
        email: record.email,
      }
    end
  end

  def get_raw_records
    User.all
  end
end
