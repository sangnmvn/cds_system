module ApplicationHelper    
  def datetime_format(param_date)
    param_date.to_date.strftime("%MMM %DD,%YYYY")
  end
end
