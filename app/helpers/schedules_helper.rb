module SchedulesHelper
  def date_format(param_date)
    date_formatter = param_date.split("/").map(&:to_i)
    Date.new(date_formatter[2], date_formatter[0], date_formatter[1]).strftime("%Y-%m-%d")
  end
end
