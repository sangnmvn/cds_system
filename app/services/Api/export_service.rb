module Api
  class ExportService < BaseService
    FILE_CLEAN_UP_TIME_IN_SECONDS = 10 * 60
    ZOOM_SCALE = 100

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

    def set_up_sheet_view(workbook, name)
      # create sheet
      sheet = workbook.add_worksheet(name: name)
      #sheet.sheet_view.zoom_scale = ZOOM_SCALE
      sheet.page_setup.set(paper_width: "297mm", paper_height: "210mm", paper_size: 10)
      # setup page in a block
      sheet.page_setup do |page|
        page.scale = 80
        page.orientation = :landscape
      end
      sheet.page_setup.set(fit_to_width: 1)
      sheet
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
        File.delete(folder + zip_file_name) if File.exist?(folder + zip_file_name)
        Zip::File.open(folder + zip_file_name, Zip::File::CREATE) do |zip_file|
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
      f = File.new("public/" + file_name)

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
      all_keys = first.keys & second.keys
      first.select! { |k, v| all_keys.include?(k) }
      second.select! { |k, v| all_keys.include?(k) }

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
      if companies_id == "All"
        companies = Company.all
      else
        companies = Company.where(id: companies_id)
      end

      h_companies = {}
      companies.map do |company|
        h_companies[company.id] = company.format_excel_name
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
          full_name: title&.user&.format_name_vietnamese,
          email: title&.user&.email,
          rank: title&.rank,
          title: title&.title,
          level: title&.level,
          rank_prev: prev_period[:rank],
          level_prev: prev_period[:level],
          title_prev: prev_period[:title],
        }
      end
      #results = {}
      #temp_users = [{ full_name: "Nguyen Van A", email: "nguyenvana@gmail.com", rank: 2, level: 1, title: "Title 2-1", rank_prev: 1, level_prev: 2, title_prev: "Title 1-2" },
      #{ full_name: "Nguyen Van B", email: "nguyenvanb@gmail.com", rank: 2, level: 2, title: "Title 2-2", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #{ full_name: "Nguyen Van C", email: "nguyenvanc@gmail.com", rank: 3, level: 2, title: "Title 3-2", rank_prev: 2, level_prev: 1, title_prev: "Title 2-1" },
      #{ full_name: "Nguyen Van D", email: "nguyenvand@gmail.com", rank: 4, level: 2, title: "Title 4-2", rank_prev: 3, level_prev: 1, title_prev: "Title 3-1" },
      #{ full_name: "Nguyen Van E", email: "nguyenvane@gmail.com", rank: 2, level: 5, title: "Title 2-5", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #{ full_name: "Nguyen Van F", email: "nguyenvanf@gmail.com", rank: 2, level: 3, title: "Title 2-3", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #{ full_name: "Nguyen Van G", email: "nguyenvang@gmail.com", rank: 4, level: 1, title: "Title 3-1", rank_prev: 3, level_prev: 1, title_prev: "Title 3-1" },
      #{ full_name: "Nguyen Van H", email: "nguyenvanha@gmail.com", rank: 2, level: 2, title: "Title 2-2", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #{ full_name: "Nguyen Van I", email: "nguyenvani@gmail.com", rank: 2, level: 3, title: "Title 2-3", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" }]
      #results[3] = {}
      #results[3][:users] = temp_users
      #results[3][:company_name] = h_companies[3]
      #results[3][:period] = Period.order(from_date: :asc).last(2).second.id
      #results[3][:prev_period] = Period.order(from_date: :asc).last(2).first.id
      #results[3][:period_excel_name] = Period.order(from_date: :asc).last(2).second.format_excel_name
      #results[3][:period_name] = Period.order(from_date: :asc).last(2).second.format_to_date
      #results[3][:period_prev_name] = Period.order(from_date: :asc).last(2).first.format_to_date

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
      all_keys = first.keys & second.keys
      first.select! { |k, v| all_keys.include?(k) }
      second.select! { |k, v| all_keys.include?(k) }

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
      if companies_id == "All"
        companies = Company.all
      else
        companies = Company.where(id: companies_id)
      end

      h_companies = {}
      companies.map do |company|
        h_companies[company.id] = company.format_excel_name
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
          full_name: title&.user&.format_name_vietnamese,
          email: title&.user&.email,
          rank: title&.rank,
          title: title&.title,
          level: title&.level,
          rank_prev: prev_period[:rank],
          level_prev: prev_period[:level],
          title_prev: prev_period[:title],
        }
      end

      #results = {}
      #temp_users = [{ full_name: "Nguyen Duc A", email: "nguyenduca@gmail.com", rank_prev: 2, level_prev: 1, title_prev: "Title 2-1", rank: 1, level: 2, title: "Title 1-2" },
      #{ full_name: "Nguyen Duc B", email: "nguyenducb@gmail.com", rank_prev: 2, level_prev: 2, title_prev: "Title 2-2", rank: 1, level: 1, title: "Title 1-1" },
      #{ full_name: "Nguyen Duc C", email: "nguyenducc@gmail.com", rank_prev: 3, level_prev: 2, title_prev: "Title 3-2", rank: 2, level: 1, title: "Title 2-1" },
      #{ full_name: "Nguyen Duc D", email: "nguyenducd@gmail.com", rank_prev: 4, level_prev: 2, title_prev: "Title 4-2", rank: 3, level: 1, title: "Title 3-1" },
      #{ full_name: "Nguyen Duc E", email: "nguyenduce@gmail.com", rank_prev: 2, level_prev: 5, title_prev: "Title 2-5", rank: 1, level: 1, title: "Title 1-1" },
      #{ full_name: "Nguyen Duc F", email: "nguyenducf@gmail.com", rank_prev: 2, level_prev: 3, title_prev: "Title 2-3", rank: 1, level: 1, title: "Title 1-1" },
      #{ full_name: "Nguyen Duc G", email: "nguyenducg@gmail.com", rank_prev: 4, level_prev: 1, title_prev: "Title 3-1", rank: 3, level: 1, title: "Title 3-1" },
      #{ full_name: "Nguyen Duc H", email: "nguyenducha@gmail.com", rank_prev: 2, level_prev: 2, title_prev: "Title 2-2", rank: 1, level: 1, title: "Title 1-1" },
      #{ full_name: "Nguyen Duc I", email: "nguyenduci@gmail.com", rank_prev: 2, level_prev: 3, title_prev: "Title 2-3", rank: 1, level: 1, title: "Title 1-1" }]
      #results[3] = {}
      #results[3][:users] = temp_users
      #results[3][:company_name] = h_companies[3]
      #results[3][:period] = Period.order(from_date: :asc).last(2).second.id
      #results[3][:prev_period] = Period.order(from_date: :asc).last(2).first.id
      #results[3][:period_excel_name] = Period.order(from_date: :asc).last(2).second.format_excel_name
      #results[3][:period_name] = Period.order(from_date: :asc).last(2).second.format_to_date
      #results[3][:period_prev_name] = Period.order(from_date: :asc).last(2).first.format_to_date

      #temp_users = [{ full_name: "Nguyen Minh A", email: "nguyenduca@gmail.com", rank_prev: 2, level_prev: 1, title_prev: "Title 2-1", rank: 1, level: 2, title: "Title 1-2" },
      #{ full_name: "Nguyen Minh B", email: "nguyenducb@gmail.com", rank_prev: 2, level_prev: 2, title_prev: "Title 2-2", rank: 1, level: 1, title: "Title 1-1" },
      #{ full_name: "Nguyen Minh C", email: "nguyenducc@gmail.com", rank_prev: 3, level_prev: 2, title_prev: "Title 3-2", rank: 2, level: 1, title: "Title 2-1" },
      #{ full_name: "Nguyen Minh D", email: "nguyenducd@gmail.com", rank_prev: 4, level_prev: 2, title_prev: "Title 4-2", rank: 3, level: 1, title: "Title 3-1" },
      #{ full_name: "Nguyen Minh E", email: "nguyenduce@gmail.com", rank_prev: 2, level_prev: 5, title_prev: "Title 2-5", rank: 1, level: 1, title: "Title 1-1" }]
      #results[2] = {}
      #results[2][:users] = temp_users
      #results[2][:company_name] = h_companies[2]
      #results[2][:period] = Period.order(from_date: :asc).last(2).second.id
      #results[2][:prev_period] = Period.order(from_date: :asc).last(2).first.id
      #results[2][:period_excel_name] = Period.order(from_date: :asc).last(2).second.format_excel_name
      #results[2][:period_name] = Period.order(from_date: :asc).last(2).second.format_to_date
      #results[2][:period_prev_name] = Period.order(from_date: :asc).last(2).first.format_to_date

      { data: results }
    end

    def data_users_keep_title_export
      number_keep = @params[:number_period_keep].to_i
      filter_users = {}
      filter_users[:company_id] = @params[:company_id] unless @params[:company_id] == "All"
      filter_users[:"project_members.project_id"] = @params[:project_id] unless @params[:project_id] == "All"
      filter_users[:role_id] = @params[:role_id] unless @params[:role_id] == "All"

      if filter_users[:company_id].nil?
        companies = Company.all
      else
        companies = Company.where(id: filter_users[:company_id])
      end

      h_companies = {}
      companies.map do |company|
        h_companies[company.id] = company.format_excel_name
      end

      user_ids = User.left_outer_joins(:project_members).where(filter_users).pluck(:id).uniq
      titles = case number_keep
        when 0
          Form.includes(:user, :period_keep, :title).where(user_id: user_ids).where("number_keep >= 1")
        when 1
          Form.includes(:user, :period_keep, :title).where(user_id: user_ids, number_keep: number_keep)
        when 2
          Form.includes(:user, :period_keep, :title).where(user_id: user_ids, number_keep: number_keep)
        when 3
          Form.includes(:user, :period_keep, :title).where(user_id: user_ids).where("number_keep >= 2")
        end

      results = {}
      titles.map do |title|
        company_id = title&.user&.company_id
        if results[company_id].nil?
          results[company_id] = {
            users: [],
            company_name: h_companies[company_id],
            period_name: title&.period&.format_name,
            period_excel_name: title&.period&.format_excel_name,
          }
        end

        results[company_id][:users] << {
          full_name: title&.user&.format_name_vietnamese,
          email: title&.user&.email,
          rank: title&.rank,
          title: title&.title.name,
          level: title&.level,
          prev_period: title&.period_keep&.id,
          period_from_name: title&.period_keep&.format_to_date,
        }
      end
      { data: results }
    end

    # How to run from rails c
    # Api::ExportService.new({}, User.find(1)).export_up_title("xlsx")
    def export_up_title
      out_data = data_users_up_title_export
      h_list = out_data[:data]
      out_file_names = []
      return "" if out_data.nil? || out_data.empty? || h_list.nil?
      return "" if h_list.keys.empty?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file
        company_name = h_data[:company_name].gsub(/ /, "")
        out_file_name = "CDS_#{company_name}_Promotion_Employee_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        # create sheet
        level_up_sheet = set_up_sheet_view(workbook, "Promotion List")
        level_up_sheet.sheet_view.zoom_scale = ZOOM_SCALE
        level_up_sheet.page_setup.set(fit_to_width: 1)
        level_up_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_up_sheet.add_row ["Promotion in the Last Period [#{h_data[:period_name]}]", "", "", "", "", "", "", "", "", ""], :style => title_format
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
      zip_file_name = "CDS_Promotion_Employee_List.zip"
      final_file_name = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_file_name)
      final_file_name
    end

    def export_down_title
      out_data = data_users_down_title_export
      h_list = out_data[:data]
      out_file_names = []
      return "" if out_data.nil? || out_data.empty? || h_list.nil?
      return "" if h_list.keys.empty?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file
        company_name = h_data[:company_name].gsub(/ /, "")
        out_file_name = "CDS_#{company_name}_Demotion_Employee_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        # create sheet
        level_down_sheet = set_up_sheet_view(workbook, "Demotion List")
        level_down_sheet.sheet_view.zoom_scale = ZOOM_SCALE
        level_down_sheet.page_setup.set(fit_to_width: 1)
        level_down_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_down_sheet.add_row ["Demotion Employee in the Last Period [#{h_data[:period_name]}]", "", "", "", "", "", "", "", "", ""], :style => title_format
        level_down_sheet.rows[1].cells[0].style = title_format
        level_down_sheet.merge_cells "A1:J1"
        level_down_sheet.merge_cells "A2:J2"
        level_down_sheet.add_row ["No.", "Employee Name", "Email", "Period #{h_data[:period_prev_name]}", "", "", "Period #{h_data[:period_name]}", "", "", "Notes"], :style => table_header_format
        level_down_sheet.add_row ["", "", "", "Title", "Rank", "Level", "Title", "Rank", "Level", "Title"], :style => table_header_format
        level_down_sheet.merge_cells "A3:A4"
        level_down_sheet.merge_cells "B3:B4"
        level_down_sheet.merge_cells "C3:C4"
        level_down_sheet.merge_cells "D3:F3"
        level_down_sheet.merge_cells "G3:I3"
        level_down_sheet.merge_cells "J3:J4"
        filtered_data_arr = h_data[:users]
        filtered_data_arr.each_with_index do |result, index|
          level_down_sheet.add_row [index + 1, result[:full_name], result[:email], result[:title_prev], result[:rank_prev], result[:level_prev], result[:title], result[:rank], result[:level], ""]
          level_down_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 4, 5, 7, 8].include?(index) }.each { |element| element.style = normal_format }
          level_down_sheet.rows[-1].cells[0].style = index_format
          level_down_sheet.rows[-1].cells[2].style = email_format
          level_down_sheet.rows[-1].cells[4].style = number_format
          level_down_sheet.rows[-1].cells[5].style = number_format
          level_down_sheet.rows[-1].cells[7].style = number_format
          level_down_sheet.rows[-1].cells[8].style = number_format
        end
        level_down_sheet.column_widths 5, 30, 30, 20, 5, 5, 20, 5, 5, 30 # run at last
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
      zip_file_name = "CDS_Demotion_Employee_List.zip"
      final_file_name = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_file_name)
      final_file_name
    end

    def export_keep_title
      out_data = data_users_keep_title_export
      h_list = out_data[:data]
      out_file_names = []
      return "" if out_data.nil? || out_data.empty? || h_list.nil?
      return "" if h_list.keys.empty?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file
        company_name = h_data[:company_name].gsub(/ /, "")
        out_file_name = "CDS_#{company_name}_No_Change_Title_Employee_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })

        no_change_sheet = set_up_sheet_view(workbook, "No Change List")
        no_change_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        no_change_sheet.add_row ["No Change Title in period [#{h_data[:period_name]}]", "", "", "", "", "", "", "", "", ""], :style => title_format
        no_change_sheet.rows[1].cells[0].style = title_format
        no_change_sheet.merge_cells "A1:J1"
        no_change_sheet.merge_cells "A2:J2"
        no_change_sheet.add_row ["No.", "Employee Name", "Email", "From Period", "Title", "Rank", "Level", "Notes"], :style => table_header_format

        filtered_data_arr = h_data[:users]
        filtered_data_arr.each_with_index do |result, index|
          no_change_sheet.add_row [index + 1, result[:full_name], result[:email], result[:period_from_name], result[:title], result[:rank], result[:level], ""]
          no_change_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 5, 6].include?(index) }.each { |element| element.style = normal_format }
          no_change_sheet.rows[-1].cells[0].style = index_format
          no_change_sheet.rows[-1].cells[2].style = email_format
          no_change_sheet.rows[-1].cells[5].style = number_format
          no_change_sheet.rows[-1].cells[6].style = number_format
        end
        no_change_sheet.column_widths 5, 30, 30, 20, 20, 5, 5, 30 # run at last
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

    def export_excel_cds_review(out_data)
      out_file_names = []
      h_list = out_data[:data]
      return "" if out_data.nil? || out_data.empty? || h_list.nil?
      return "" if h_list.keys.empty?

      h_list.each do |company_id, h_data|
        package = Axlsx::Package.new
        workbook = package.workbook
        # preparing data
        period = h_data[:period]
        period_prev = h_data[:prev_period]
        period_excel_name = h_data[:period_excel_name]
        # making file

        company_name = h_data[:company_name].gsub(/ /, "")

        out_file_name = "CDS_#{company_name}_Title_Comparison_List_in_Period_#{period_excel_name}"
        # formatting Excel
        title_format = workbook.styles.add_style(:sz => 18, :b => true, :bg_color => "FFFFFF", :fg_color => "2E75B8", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        table_header_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "2E75B8", :fg_color => "FFFFFF", :font_name => "Calibri", :border => { :style => :thin, :color => "FFFFFF", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        normal_improved_format = workbook.styles.add_style(:sz => 11, :b => true, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        normal_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        index_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :center, :vertical => :top, :wrap_text => :true })
        number_improved_format = workbook.styles.add_style(:sz => 11, :b => true, :u => true, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        number_format = workbook.styles.add_style(:sz => 11, :bg_color => "FFFFFF", :fg_color => "000000", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :right, :vertical => :top, :wrap_text => :true })
        email_format = workbook.styles.add_style(:sz => 11, :bg_color => "C0C0C0", :fg_color => "017EAF", :font_name => "Calibri", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
        # create sheet
        title_comparison_sheet = set_up_sheet_view(workbook, "Title Comparison")

        title_comparison_sheet.sheet_view.zoom_scale = ZOOM_SCALE
        title_comparison_sheet.page_setup.set(fit_to_width: 1)
        title_comparison_sheet.add_row ["", "", "", "", "", "", "", "", "", ""], :style => title_format
        title_comparison_sheet.add_row ["Title/Rank/Level Comparison between period #{h_data[:period_prev_name]} and period #{h_data[:period_name]}", "", "", "", "", "", "", "", "", ""], :style => title_format
        title_comparison_sheet.rows[1].cells[0].style = title_format
        title_comparison_sheet.merge_cells "A1:J1"
        title_comparison_sheet.merge_cells "A2:J2"
        title_comparison_sheet.add_row ["No.", "Employee Name", "Email", "Period #{h_data[:period_prev_name]}", "", "", "Period #{h_data[:period_name]}", "", "", "Notes"], :style => table_header_format
        title_comparison_sheet.add_row ["", "", "", "Title", "Rank", "Level", "Title", "Rank", "Level", "Title"], :style => table_header_format
        title_comparison_sheet.merge_cells "A3:A4"
        title_comparison_sheet.merge_cells "B3:B4"
        title_comparison_sheet.merge_cells "C3:C4"
        title_comparison_sheet.merge_cells "D3:F3"
        title_comparison_sheet.merge_cells "G3:I3"
        title_comparison_sheet.merge_cells "J3:J4"
        filtered_data_arr = h_data[:users]
        filtered_data_arr.each_with_index do |result, index|
          title_comparison_sheet.add_row [index + 1, result[:full_name], result[:email], result[:title_prev], result[:rank_prev], result[:level_prev], result[:title], result[:rank], result[:level], ""]
          title_comparison_sheet.rows[-1].cells.reject.with_index { |element, index| [0, 2, 4, 5, 6, 7, 8].include?(index) }.each { |element| element.style = normal_format }
          title_comparison_sheet.rows[-1].cells[0].style = index_format
          title_comparison_sheet.rows[-1].cells[2].style = email_format
          title_comparison_sheet.rows[-1].cells[4].style = number_format
          title_comparison_sheet.rows[-1].cells[5].style = number_format
          # underline increased value
          title_comparison_sheet.rows[-1].cells[6].style = result[:rank] > result[:rank_prev] ? normal_improved_format : normal_format
          title_comparison_sheet.rows[-1].cells[7].style = result[:rank] > result[:rank_prev] ? number_improved_format : number_format
          title_comparison_sheet.rows[-1].cells[8].style = result[:rank] > result[:rank_prev] || (result[:level] > result[:level_prev] && result[:rank] == result[:rank_prev]) ? number_improved_format : number_format
        end
        title_comparison_sheet.column_widths 5, 30, 30, 20, 5, 5, 20, 5, 5, 30 # run at last
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
      zip_file_name = "CDS_Title_Comparison_List.zip"
      final_file_name = repack_zip_if_multiple(out_file_names, zip_file_name)
      schedule_file_for_clean_up(final_file_name)
      final_file_name
    end

    def clean_up_public_folder
      remain_file = Dir["public/*.xlsx"] + Dir["public/*.pdf"] + Dir["public/*.zip"]
      remain_file.each do |file_name|
        File.delete(file_name) if File.exist?(file_name)
      end
    end
  end
end
