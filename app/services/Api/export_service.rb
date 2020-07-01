module Api
  class ExportService < BaseService
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

    # Api::ExportService.new({}, User.find(1)).export_excel_up_title("ots", {}])
    #filter[:company_id], filter[:role_id], filter[:project_members]
    def export_excel_up_title(extension)
      outdata = @user_mgmt_service.data_users_up_title
      data_arr = outdata[:data]

      package = Axlsx::Package.new
      workbook = package.workbook

      company_ids = outdata[:company_ids]

      company_ids.each do |company_id|
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })

        level_up_sheet = workbook.add_worksheet(:name => "Level Up")
        level_up_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.add_row ["[Company Name] Promotion Employee in the Latest Period [from date to date]", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.rows[1].cells[0].style = title_format
        level_up_sheet.merge_cells "A1:J1"
        level_up_sheet.merge_cells "A2:J2"
        level_up_sheet.add_row ["No.", "Employee Name", "Email", "Project Name", "Period #{data_arr[0][:period_name_prev]}", "", "", "Period #{data_arr[0][:period_name]}", "", "", "Notes"], :style => table_header_format
        level_up_sheet.add_row ["", "", "", "", "Title", "Rank", "Level", "Title", "Rank", "Level", ""], :style => table_header_format
        level_up_sheet.merge_cells "A3:A4"
        level_up_sheet.merge_cells "B3:B4"
        level_up_sheet.merge_cells "C3:C4"
        level_up_sheet.merge_cells "D3:D4"
        level_up_sheet.merge_cells "E3:G3"
        level_up_sheet.merge_cells "H3:J3"
        level_up_sheet.merge_cells "L3:L4"

        filtered_data_arr = data_arr.select { |result| result[:company_id] == company_id }
        filtered_data_arr.each_with_index do |result, index|
          #email_after_formatted = Axlsx::RichText.new
          #email_after_formatted.add_run(result[:email], :sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri")

          level_up_sheet.add_row [index + 1, result[:full_name], result[:email], result[:project_name], result[:title_prev], result[:rank_prev], result[:level_prev], result[:title], result[:rank], result[:level], ""]

          level_up_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 5, 6, 8, 9].include?(index) }.each { |element| element.style = normal_format }
          level_up_sheet.rows[-1].cells[0].style = index_format
          level_up_sheet.rows[-1].cells[2].style = email_format
          level_up_sheet.rows[-1].cells[5].style = number_format
          level_up_sheet.rows[-1].cells[6].style = number_format
          level_up_sheet.rows[-1].cells[8].style = number_format
          level_up_sheet.rows[-1].cells[9].style = number_format
        end
        # If OTS then create a different xlsx file
        # so as not to delete existing xlsx file
        # name for temp file
        if extension.downcase == "ots"
          xlsx_name = "public/temp.xlsx"
        else
          xlsx_name = "public/test.xlsx"
        end

        level_up_sheet.column_widths 5, 30, 30, 30, 30, 10, 10, 30, 10, 10, 25 # run at last

        package.serialize(xlsx_name)

        if extension.downcase == "ots"
          ots_name = "public/test.ots"
          Libreconv.convert(xlsx_name, ots_name, nil, "ots")
          File.delete(xlsx_name) if File.exist?(xlsx_name)
          File.basename(ots_name)
        elsif extension.downcase == "xlsx"
          File.basename(xlsx_name)
        end
      end
    end
  end
end
