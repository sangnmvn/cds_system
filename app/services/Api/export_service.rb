module Api
  class ExportService < BaseService
    FILE_CLEAN_UP_TIME_IN_SECONDS = 10 * 60

    def initialize(params, current_user)
      groups = Group.joins(:user_group).where(user_groups: { user_id: current_user.id })
      privilege_array = []
      groups.each do |group|
        privilege_array += group&.list_privileges
      end
      @privilege_array = privilege_array
      @current_user = current_user
      @params = params
    end

    def repack_zip_if_multiple(file_names, zip_file_name = nil)
      # - Turn files into zip if multiple files
      # Caution: DELETE all file if ZIP is applied
      # - Else return the current file without deletion
      # If multiple files download .zip, if 1 file download the only file
      if file_names.length.zero?
        nil
      elsif file_names.length == 1
        file_names[0]
      else
        folder = "public/"
        File.delete(zip_file_name) if File.exist?(zip_file_name)
        Zip::File.open("public/#{zip_file_name}", Zip::File::CREATE) do |zip_file|
          file_names.each do |file_name|
            # Two arguments:
            # - The name of the file as it will appear in the archive
            # - The original file, including the path to find it
            in_file_name = File.join(folder, file_name)
            zip_file.add(file_name, in_file_name) { true }
          end
        end
        file_names.each do |file_name|
          in_file_name = File.join(folder, file_name)
          File.delete(in_file_name) if File.exist?(in_file_name)
        end
        zip_file_name
      end
    end

    def schedule_file_for_clean_up(file_name)
      # Delete the file after FILE_CLEAN_UP_TIME seconds
      # 1. every second check if the file is replaced
      #-> File belongs to new requests and current requests are overwritten
      # 2. else after time has passed delete the file
      # Precondition: File must be in public folder WITHOUT the 'public/' in the path
      f = File.new("public/#{file_name}")

      # get original creation time
      creation_time = f.ctime
      Thread.new do
        (0...FILE_CLEAN_UP_TIME_IN_SECONDS).each do |_i|
          sleep 1
          begin
            f = File.new("public/#{file_name}")
            new_creation_time = f.ctime
            if creation_time != new_creation_time
              # File has been modified, exit the thread
              # Later thread will clean it up
              Thread.exit
            end
          rescue StandardError
            # File has been deleted so deleting the file later is useless
            Thread.exit
          end
        end

        f = File.new("public/#{file_name}")
        new_creation_time = f.ctime
        if creation_time == new_creation_time
          File.delete("public/" + file_name)
        end
      end
    end

    def export_excel_cds_review(data)
    end

    def export_excel_cds_approve(data)
    end

    def data_users_up_title_export
      filter_users = {}
      filter_users[:company_id] = @params[:company_id] unless @params[:company_id] == "All"
      filter_users[:role_id] = @params[:role_id] unless @params[:role_id] == "All"
      filter_users[:"project_members.project_id"] = @params[:project_id] unless @params[:project_id] == "All"

      user_ids = User.joins(:project_members).where(filter_users).pluck(:id)
      schedules = Schedule.where(status: "Done").order(end_date_hr: :desc)

      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end
      title_first = TitleHistory.includes([:user, :period]).where(user_id: user_ids, period_id: first.values)
      title_second = TitleHistory.includes(:period).where(user_id: user_ids, period_id: second.values).to_a
      h_previous_period = {}
      title_second.map do |title|
        h_previous_period[title.user_id] = {
          rank: title.rank,
          level: title.level,
          title: title.title,
          name: title&.period&.format_to_date,
        }
      end
      results = {}
      companies_id = @params[:company_id]
      h_companies = if companies_id == "All"
          Company.pluck([:id, :name]).to_h
        else
          Company.where(id: companies_id).pluck([:id, :name]).to_h
        end

      title_first.map do |title|
        prev_period = h_previous_period[title.user_id]
        next if title.rank <= prev_period[:rank]

        company_id = title&.user&.company_id
        if results[company_id].nil?
          results[company_id] = {
            users: [],
            company_name: h_companies[company_id],
            period: first[company_id],
            prev_period: second[company_id],
            period_excel_name: title&.period&.format_excel_name,
            period_name: title&.period&.format_to_date,
            period_prev_name: prev_period[:name],
          }
        end
        results[company_id][:users] << {
          full_name: title&.user&.format_name,
          email: title&.user&.email,
          rank: title&.rank,
          title: title&.title,
          level: title&.level,
          rank_prev: prev_period[:rank],
          level_prev: prev_period[:level],
          title_prev: prev_period[:title],
        }
      end

      { data: results }
    end

    def data_users_down_title_export
      filter_users = {}
      filter_users[:company_id] = @params[:company_id] unless @params[:company_id] == "All"
      filter_users[:role_id] = @params[:role_id] unless @params[:role_id] == "All"
      filter_users[:"project_members.project_id"] = @params[:project_id] unless @params[:project_id] == "All"

      user_ids = User.joins(:project_members).where(filter_users).pluck(:id)
      schedules = Schedule.where(status: "Done").order(end_date_hr: :desc)

      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end
      title_first = TitleHistory.includes([:user, :period]).where(user_id: user_ids, period_id: first.values)
      title_second = TitleHistory.includes(:period).where(user_id: user_ids, period_id: second.values).to_a
      h_previous_period = {}
      title_second.map do |title|
        h_previous_period[title.user_id] = {
          rank: title.rank,
          level: title.level,
          title: title.title,
          name: title&.period&.format_to_date,
        }
      end
      results = {}
      companies_id = @params[:company_id]
      h_companies = if companies_id == "All"
          Company.pluck([:id, :name]).to_h
        else
          Company.where(id: companies_id).pluck([:id, :name]).to_h
        end

      title_first.map do |title|
        prev_period = h_previous_period[title.user_id]
        next if title.rank >= prev_period[:rank]

        company_id = title&.user&.company_id
        if results[company_id].nil?
          results[company_id] = {
            users: [],
            company_name: h_companies[company_id],
            period: first[company_id],
            prev_period: second[company_id],
            period_excel_name: title&.period&.format_excel_name,
            period_name: title&.period&.format_to_date,
            period_prev_name: prev_period[:name],
          }
        end
        results[company_id][:users] << {
          full_name: title&.user&.format_name,
          email: title&.user&.email,
          rank: title&.rank,
          title: title&.title,
          level: title&.level,
          rank_prev: prev_period[:rank],
          level_prev: prev_period[:level],
          title_prev: prev_period[:title],
        }
      end

      { data: results }
    end

    def data_users_keep_title_export
      filter_users = {}
      filter_users[:company_id] = @params[:company_id] unless @params[:company_id] == "All"
      filter_users[:role_id] = @params[:role_id] unless @params[:role_id] == "All"
      filter_users[:"project_members.project_id"] = @params[:project_id] unless @params[:project_id] == "All"

      user_ids = User.joins(:project_members).where(filter_users).pluck(:id)
      schedules = Schedule.where(status: "Done").order(end_date_hr: :desc)

      first = {}
      second = {}
      schedules.map do |schedule|
        if first[schedule.company_id].nil?
          first[schedule.company_id] = schedule.period_id
        elsif second[schedule.company_id].nil?
          second[schedule.company_id] = schedule.period_id
        end
      end
      title_first = TitleHistory.includes([:user, :period]).where(user_id: user_ids, period_id: first.values)
      title_second = TitleHistory.includes(:period).where(user_id: user_ids, period_id: second.values).to_a
      h_previous_period = {}
      title_second.map do |title|
        h_previous_period[title.user_id] = {
          rank: title.rank,
          level: title.level,
          title: title.title,
          name: title&.period&.format_to_date,
        }
      end
      results = {}
      companies_id = @params[:company_id]
      h_companies = if companies_id == "All"
          Company.pluck([:id, :name]).to_h
        else
          Company.where(id: companies_id).pluck([:id, :name]).to_h
        end

      title_first.map do |title|
        prev_period = h_previous_period[title.user_id]
        next if title.rank != prev_period[:rank]

        company_id = title&.user&.company_id
        if results[company_id].nil?
          results[company_id] = {
            users: [],
            company_name: h_companies[company_id],
            period: first[company_id],
            prev_period: second[company_id],
            period_excel_name: title&.period&.format_excel_name,
            period_name: title&.period&.format_to_date,
            period_prev_name: prev_period[:name],
          }
        end
        results[company_id][:users] << {
          full_name: title&.user&.format_name,
          email: title&.user&.email,
          rank: title&.rank,
          title: title&.title,
          level: title&.level,
          rank_prev: prev_period[:rank],
          level_prev: prev_period[:level],
          title_prev: prev_period[:title],
        }
      end

      { data: results }
    end

    # How to run from rails c
    # Api::ExportService.new({}, User.find(1)).export_up_title("xlsx")
    def export_up_title
      outdata = data_users_up_title_export
      h_list = outdata[:data]
      out_file_names = []
      return "" unless h_list.keys.any?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file
        company_name = h_data[:company_name].gsub(/ /, "")
        out_file_name = "CDS_Company_#{company_name}_Promotion_Employee_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        # create sheet
        level_up_sheet = workbook.add_worksheet(:name => "Promotion List")
        level_up_sheet.page_setup.set(fit_to_width: 1)
        level_up_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.add_row ["Promotion Employee in the Latest Period [#{h_data[:period_name]}]", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.rows[1].cells[0].style = title_format
        level_up_sheet.merge_cells "A1:J1"
        level_up_sheet.merge_cells "A2:J2"
        level_up_sheet.add_row ["No.", "Employee Name", "Email", "Period #{h_data[:period_prev_name]}", "", "", "Period #{h_data[:period_name]}", "", "", "Notes"], :style => table_header_format
        level_up_sheet.add_row ["", "", "", "Title", "Rank", "Level", "Title", "Rank", "Level", "Title"], :style => table_header_format
        level_up_sheet.merge_cells "A3:A4"
        level_up_sheet.merge_cells "B3:B4"
        level_up_sheet.merge_cells "C3:C4"
        level_up_sheet.merge_cells "D3:F3"
        level_up_sheet.merge_cells "G3:I3"
        level_up_sheet.merge_cells "J3:J4"
        filtered_data_arr = h_data[:users]
        filtered_data_arr.each_with_index do |result, index|
          level_up_sheet.add_row [index + 1, result[:full_name], result[:email], result[:title_prev], result[:rank_prev], result[:level_prev], result[:title], result[:rank], result[:level], ""]
          level_up_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 4, 5, 7, 8].include?(index) }.each { |element| element.style = normal_format }
          level_up_sheet.rows[-1].cells[0].style = index_format
          level_up_sheet.rows[-1].cells[2].style = email_format
          level_up_sheet.rows[-1].cells[4].style = number_format
          level_up_sheet.rows[-1].cells[5].style = number_format
          level_up_sheet.rows[-1].cells[7].style = number_format
          level_up_sheet.rows[-1].cells[8].style = number_format
        end
        level_up_sheet.column_widths 5, 30, 30, 20, 5, 5, 20, 5, 5, 30 # run at last
        # getting output file to public/
        extension = @params[:ext]
        if extension.downcase == "xlsx"
          package.serialize("public/#{out_file_name}.xlsx")
          out_file_names << File.basename("#{out_file_name}.xlsx")
        elsif extension.downcase == "pdf"
          package.serialize("public/temp.xlsx")
          Libreconv.convert("public/temp.xlsx", "public/#{out_file_name}.pdf", nil, "pdf:calc_pdf_Export")
          File.delete("public/temp.xlsx") if File.exist?("public/temp.xlsx")
          out_file_names << File.basename("#{out_file_name}.pdf")
        end
      end
      zip_file_name = "public/CDS_Promotion_Employee_List.zip"
      final_file_name = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_file_name)
      final_file_name
    end

    # Api::ExportService.new({}, User.find(1)).export_up_title("xlsx")
    def export_down_title
      outdata = data_users_down_title_export
      h_list = outdata[:data]
      out_file_names = []
      return "" unless h_list.keys.any?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file
        company_name = h_data[:company_name].gsub(/ /, "")
        out_file_name = "CDS_Company_#{company_name}_Demotion_Employee_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        # create sheet
        level_up_sheet = workbook.add_worksheet(:name => "Demotion List")
        level_up_sheet.page_setup.set(fit_to_width: 1)
        level_up_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.add_row ["Demotion Employee in the Latest Period [#{h_data[:period_name]}]", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.rows[1].cells[0].style = title_format
        level_up_sheet.merge_cells "A1:J1"
        level_up_sheet.merge_cells "A2:J2"
        level_up_sheet.add_row ["No.", "Employee Name", "Email", "Period #{h_data[:period_prev_name]}", "", "", "Period #{h_data[:period_name]}", "", "", "Notes"], :style => table_header_format
        level_up_sheet.add_row ["", "", "", "Title", "Rank", "Level", "Title", "Rank", "Level", "Title"], :style => table_header_format
        level_up_sheet.merge_cells "A3:A4"
        level_up_sheet.merge_cells "B3:B4"
        level_up_sheet.merge_cells "C3:C4"
        level_up_sheet.merge_cells "D3:F3"
        level_up_sheet.merge_cells "G3:I3"
        level_up_sheet.merge_cells "J3:J4"
        filtered_data_arr = h_data[:users]
        filtered_data_arr.each_with_index do |result, index|
          level_up_sheet.add_row [index + 1, result[:full_name], result[:email], result[:title_prev], result[:rank_prev], result[:level_prev], result[:title], result[:rank], result[:level], ""]
          level_up_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 4, 5, 7, 8].include?(index) }.each { |element| element.style = normal_format }
          level_up_sheet.rows[-1].cells[0].style = index_format
          level_up_sheet.rows[-1].cells[2].style = email_format
          level_up_sheet.rows[-1].cells[4].style = number_format
          level_up_sheet.rows[-1].cells[5].style = number_format
          level_up_sheet.rows[-1].cells[7].style = number_format
          level_up_sheet.rows[-1].cells[8].style = number_format
        end
        level_up_sheet.column_widths 5, 30, 30, 20, 5, 5, 20, 5, 5, 30 # run at last
        # getting output file to public/
        extension = @params[:ext]
        if extension.downcase == "xlsx"
          package.serialize("public/#{out_file_name}.xlsx")
          out_file_names << File.basename("#{out_file_name}.xlsx")
        elsif extension.downcase == "pdf"
          package.serialize("public/temp.xlsx")
          Libreconv.convert("public/temp.xlsx", "public/#{out_file_name}.pdf", nil, "pdf:calc_pdf_Export")
          File.delete("public/temp.xlsx") if File.exist?("public/temp.xlsx")
          out_file_names << File.basename("#{out_file_name}.pdf")
        end
      end
      zip_file_name = "public/CDS_Demotion_Employee_List.zip"
      final_file_name = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_file_name)
      final_file_name
    end

    def export_keep_title
      outdata = data_users_keep_title_export
      h_list = outdata[:data]
      out_file_names = []
      return "" unless h_list.keys.any?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file
        company_name = h_data[:company_name].gsub(/ /, "")
        out_file_name = "CDS_Company_#{company_name}_No_Change_Title_Employee_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        # create sheet
        level_up_sheet = workbook.add_worksheet(:name => "No Change List")
        level_up_sheet.page_setup.set(fit_to_width: 1)
        level_up_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.add_row ["List of employee has no change level in period [#{h_data[:period_name]}]", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.rows[1].cells[0].style = title_format
        level_up_sheet.merge_cells "A1:J1"
        level_up_sheet.merge_cells "A2:J2"
        level_up_sheet.add_row ["No.", "Employee Name", "Email", "From Period", "Title", "Rank", "Level", "Notes"], :style => table_header_format

        filtered_data_arr = h_data[:users]
        filtered_data_arr.each_with_index do |result, index|
          level_up_sheet.add_row [index + 1, result[:full_name], result[:email], result[:period_from_name], result[:title], result[:rank], result[:level], ""]
          level_up_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 5, 6].include?(index) }.each { |element| element.style = normal_format }
          level_up_sheet.rows[-1].cells[0].style = index_format
          level_up_sheet.rows[-1].cells[2].style = email_format
          level_up_sheet.rows[-1].cells[5].style = number_format
          level_up_sheet.rows[-1].cells[6].style = number_format
        end
        level_up_sheet.column_widths 5, 30, 30, 20, 20, 5, 5, 30 # run at last
        # getting output file to public/
        extension = @params[:ext]
        if extension.downcase == "xlsx"
          package.serialize("public/#{out_file_name}.xlsx")
          out_file_names << File.basename("#{out_file_name}.xlsx")
        elsif extension.downcase == "pdf"
          package.serialize("public/temp.xlsx")
          Libreconv.convert("public/temp.xlsx", "public/#{out_file_name}.pdf", nil, "pdf:calc_pdf_Export")
          File.delete("public/temp.xlsx") if File.exist?("public/temp.xlsx")
          out_file_names << File.basename("#{out_file_name}.pdf")
        end
      end
      zip_file_name = "CDS_No_Change_Title_Employee_List.zip"
      final_file_name = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_file_name)
      final_file_name
    end
  end
end
