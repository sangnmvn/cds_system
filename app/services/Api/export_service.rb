module Api
  class ExportService < BaseService
    FILE_CLEANUP_TIME_IN_SECONDS = 10 * 60

    def initialize(params, current_user)
      groups = Group.joins(:user_group).where(user_groups: { user_id: current_user.id })
      privilege_array = []
      groups.each do |group|
        privilege_array += group&.list_privileges
      end
      @privilege_array = privilege_array
      @current_user = current_user
      @params = params

      @user_mgmt_service ||= Api::UserManagementService.new(params, current_user)
    end

    def repack_zip_if_multiple(filenames, zip_filename = nil)
      # - Turn files into zip if multiple files
      # Caution: DELETE all file if ZIP is applied
      # - Else return the current file without deletion
      # If multiple files download .zip, if 1 file download the only file
      if filenames.length.zero?
        nil
      elsif filenames.length == 1
        filenames[0]
      else
        folder = "public/"
        Zip::File.open(zip_filename, Zip::File::CREATE) do |zipfile|
          filenames.each do |filename|
            # Two arguments:
            # - The name of the file as it will appear in the archive
            # - The original file, including the path to find it
            in_filename = File.join(folder, filename)
            zipfile.add(filename, in_filename)
          end
        end
        filenames.each do |filename|
          in_filename = File.join(folder, filename)
          File.delete(in_filename) if File.exist?(in_filename)
        end
        zip_filename
      end
    end

    def schedule_file_for_clean_up(filename)
      # Delete the file after FILE_CLEAN_UP_TIME seconds
      # 1. every second check if the file is replaced
      #-> File belongs to new requests and current requests are overwritten
      # 2. else after time has passed delete the file
      # Precondition: File must be in public folder WITHOUT the 'public/' in the path
      f = File.new("public/#{filename}")

      # get original creation time
      creation_time = f.ctime
      Thread.new do
        (0...FILE_CLEANUP_TIME_IN_SECONDS).each do |_i|
          sleep 1
          begin
            f = File.new("public/#{filename}")
            new_creation_time = f.ctime
            if creation_time != new_creation_time
              # File has been modified, exit the thread
              # Later thread will clean it up
              Thread.exit
            end
          rescue StandardError
            Thread.exit
          end
        end

        f = File.new("public/#{filename}")
        new_creation_time = f.ctime
        if creation_time == new_creation_time
          File.delete("public/" + filename)
        end
      end
    end

    # Api::ExportService.new({}, User.find(1)).export_excel_up_title("xlsx")
    def export_excel_up_title(extension)
      outdata = @user_mgmt_service.data_users_up_title
      data_arr = outdata[:data]
      company_ids = outdata[:company_ids]
      out_file_names = []
      company_ids.each do |company_id|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        filtered_data_arr = data_arr.select { |result| result[:company_id] == company_id }
        period_prev = filtered_data_arr[0][:period_name_prev]
        period = filtered_data_arr[0][:period_name]
        period_excel_name = filtered_data_arr[0][:period_excel_name]
        # making file
        company_name = filtered_data_arr[0][:company_name].gsub(/ /, "")
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
        level_up_sheet.add_row ["Promotion Employee in the Latest Period [#{period}]", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.rows[1].cells[0].style = title_format
        level_up_sheet.merge_cells "A1:J1"
        level_up_sheet.merge_cells "A2:J2"
        level_up_sheet.add_row ["No.", "Employee Name", "Email", "Period #{data_arr[0][:period_name_prev]}", "", "", "Period #{data_arr[0][:period_name]}", "", "", "Notes"], :style => table_header_format
        level_up_sheet.add_row ["", "", "", "Title", "Rank", "Level", "Title", "Rank", "Level", "Title"], :style => table_header_format
        level_up_sheet.merge_cells "A3:A4"
        level_up_sheet.merge_cells "B3:B4"
        level_up_sheet.merge_cells "C3:C4"
        level_up_sheet.merge_cells "D3:F3"
        level_up_sheet.merge_cells "G3:I3"
        level_up_sheet.merge_cells "J3:J4"

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
      final_filename = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_filename)
      final_filename
    end
  end
end
