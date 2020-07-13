module ApplicationHelper    
  def date_format(param_date)
    param_date.to_date.strftime("%Y-%m-%d")
  end
end
