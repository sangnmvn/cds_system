module TitleMappingsHelper
  POINT_LEVEL_MAP = [[1, "0-1"], [99, "++1"], [100, "1"], [101, "1-2"], [199, "++2"], [200, "2"], [201, "2-3"], [299, "++3"], [300, "3"], [301, "3-4"], [399, "++4"], [400, "4"], [401, "4-5"], [499, "++5"], [500, "5"], [501, "5-6"], [599, "++6"], [600, "6"]]

  def self.convert_value_title_mapping(res)
    if res.is_a? Integer
      converted_value = POINT_LEVEL_MAP[0][1]
      POINT_LEVEL_MAP.each_with_index do |point_level, index|
        point, level = point_level
        if res == point
          return level
        elsif res < point
          return POINT_LEVEL_MAP[index - 1][1]
        end
      end
    elsif res.is_a? String
      converted_value = POINT_LEVEL_MAP[0][0]
      POINT_LEVEL_MAP.each_with_index do |point_level, index|
        point, level = point_level
        if res == level
          return point
        end
      end
    end
    converted_value
  end
end
