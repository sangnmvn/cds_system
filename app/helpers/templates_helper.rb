module TemplatesHelper
  def get_format_key_name(format_hash, text, recursive_level, parent_index, self_index)
    if recursive_level > 0
      parent_level = recursive_level - 1
      key = text + NEVER_USE_CHARACTER + parent_level.to_s + NEVER_USE_CHARACTER + parent_index.to_s
    else
      key = text + NEVER_USE_CHARACTER + recursive_level.to_s + NEVER_USE_CHARACTER + self_index.to_s
    end
  end

  def element_to_rich_text(html_element, recursive_level = 0, format_arr = nil, index_arr = nil, parent_index = nil)
    if format_arr.nil?
      format_arr = Hash.new { |h, k| h[k] = [] }
      index_arr = []
    end
    is_root = (recursive_level == 0) ? true : false

    if html_element.name == "strong"
      html_element.children.each_with_index do |children, child_index|
        text = element_to_rich_text(children, recursive_level + 1, format_arr, index_arr, child_index)
        text_key = get_format_key_name(format_arr, text, recursive_level, parent_index, child_index)
        format_arr[text_key].push(:b)

        is_already_included = false
        index_arr.each do |arr_info|
          index_text = arr_info[0]
          if index_text == text
            is_already_included = true
            break
          end
        end

        index_arr.push [text, recursive_level] unless is_already_included
      end
      return html_element.children.text unless is_root
    elsif html_element.name == "em"
      html_element.children.each_with_index do |children, child_index|
        text = element_to_rich_text(children, recursive_level + 1, format_arr, index_arr, child_index)
        text_key = get_format_key_name(format_arr, text, recursive_level, parent_index, child_index)
        format_arr[text_key].push(:i)

        is_already_included = false
        index_arr.each do |arr_info|
          index_text = arr_info[0]
          if index_text == text
            is_already_included = true
            break
          end
        end

        index_arr.push [text_key, recursive_level] unless is_already_included
      end
      return html_element.children.text unless is_root
    elsif html_element.name == "p"
      html_element.children.each_with_index do |children, child_index|
        text = element_to_rich_text(children, recursive_level + 1, format_arr, index_arr, child_index)
        text_key = get_format_key_name(format_arr, text, recursive_level, parent_index, child_index)
        format_arr[text_key].push(:p)

        is_already_included = false

        index_arr.each do |arr_info|
          index_text = arr_info[0]
          if index_text == text
            is_already_included = true
            break
          end
        end

        index_arr.push [text, recursive_level] unless is_already_included
      end
      return html_element.children.text unless is_root
    elsif html_element.name == "text"
      if is_root
        text = html_element.text
        format_arr[text] = []
        index_arr.push [text, recursive_level]
        return format_arr, index_arr
      else
        return html_element.text
      end
    end
    return format_arr, index_arr if is_root
  end

  def from_HTML_to_axlsx_text(html)
    html_tree = Nokogiri::HTML.parse(html)
    return html_tree.text
    innerHTML = html_tree.children[1].children[0].css("p")

    final_text = Axlsx::RichText.new

    rt = Axlsx::RichText.new

    innerHTML.children.each_with_index do |children_element, element_index|
      format_arr, index_arr = element_to_rich_text(children_element)
      format = { :b => false, :i => false, :p => false }
      parent_index = []

      (0...(index_arr.length)).each do |i|
        next if parent_index.include?(i)
        text, level = index_arr[i]
        current_format = format_arr[text]
        text = text.split(NEVER_USE_CHARACTER)[0]

        format[:b] = current_format.include?(:b)
        format[:i] = current_format.include?(:i)
        format[:p] = current_format.include?(:p)
        (i + 1...(index_arr.length)).each do |j|
          next_text, next_level = index_arr[j]
          next_format = format_arr[next_text]
          if next_text.include?(text) && next_level < level && next_level > 1
            format[:b] = format[:b] | next_format.include?(:b)
            format[:i] = format[:i] | next_format.include?(:i)
            format[:p] = format[:p] | next_format.include?(:p)

            parent_index.push j
          end
        end

        if (i == 0)
          final_text = format[:p] ? "\n#{text}" : text
        elsif (i == index_arr.length - 1)
          final_text = format[:p] ? "#{text}\n" : text
        else
          final_text = text
        end

        if element_index == 0
          rt.add_run(final_text.lstrip, :b => format[:b], :i => format[:i], :font_name => "Arial", :sz => 10)
        else
          rt.add_run(final_text, :b => format[:b], :i => format[:i], :font_name => "Arial", :sz => 10)
        end
      end
    end
    rt
  end
end
