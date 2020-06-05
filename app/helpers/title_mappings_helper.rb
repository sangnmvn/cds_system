module TitleMappingsHelper
  def convert_value_title_mapping(res)
    case res
    when 1
      "0-1"
    when "0-1"
      1
    when 99
      "++1"
    when "++1"
      99
    end
  end
end
