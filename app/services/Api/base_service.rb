module Api
  class BaseService
    LETTER_CAP = *("A".."Z")
    LIMIT = 20
    POINT_LEVEL_INTEGER = [1, 99, 100, 101, 199, 200, 201, 299, 300, 301, 399, 400,
                           401, 499, 500, 501, 599, 600, 601, 699, 700, 701, 799, 800].freeze
    POINT_LEVEL_STRING = ["0-1", "++1", "1", "1-2", "++2", "2", "2-3", "++3", "3", "3-4", "++4", "4",
                          "4-5", "++5", "5", "5-6", "++6", "6", "6-7", "++7", "7", "7-8", "++8", "8"].freeze

    private

    def convert_value_title_mapping(res)
      data = if res.is_a? Integer
          index = POINT_LEVEL_INTEGER.find_index(res)
          POINT_LEVEL_STRING[index] if index.present?
        elsif res.is_a? String
          index = POINT_LEVEL_STRING.find_index(res)
          POINT_LEVEL_INTEGER[index] if index.present?
        end
      data || 0
    end

    def format_long_date(date)
      return "N/A" if date.nil?
      return date.strftime("%b %d, %Y") if date.is_a?(Date) || date.is_a?(DateTime)
      ""
    end
  end
end
