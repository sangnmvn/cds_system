module Api
  class ExportService < BaseService
    FILE_CLEAN_UP_TIME_IN_SECONDS = 10 * 60
    ZOOM_SCALE = 100
    ROMAN_NUMBERS = {
      1000 => "M",
      900 => "CM",
      500 => "D",
      400 => "CD",
      100 => "C",
      90 => "XC",
      50 => "L",
      40 => "XL",
      10 => "X",
      9 => "IX",
      5 => "V",
      4 => "IV",
      1 => "I",
    }

    # for string operation
    NEVER_USE_CHARACTER = "Ω"

    def squish_keep_newline(s)
      # convert new line to an unused character and restore it back
      new_s = s.strip
      new_s.gsub!(/\n/, NEVER_USE_CHARACTER)
      new_s.squish!
      new_s.gsub!(Regexp.new NEVER_USE_CHARACTER, "\n")
      new_s.gsub(/\n{1}[ \t]*/, "\n")
    end

    def roman(n)
      roman = ""
      ROMAN_NUMBERS.each do |value, letter|
        roman << letter * (n / value)
        n = n % value
      end
      roman
    end

    ALPH = ("a".."z").to_a

    def calculate_height(s)
      # calculate height in excel
      height = 0
      sentences = s.lines
      sentences.each do |sentence|
        sentence_height = (sentence.length + 111) / 112 # lam tron len
        sentence_height += (sentence.scan(/<p>/).length + 1) / 2
        height += sentence_height
      end
      height * 13
    end

    # 1 -> a, 2 -> b
    def alph(n)
      return "" if n < 1
      s, q = "", n
      loop do
        q, r = (q - 1).divmod(26)
        s.prepend(ALPH[r])
        break if q.zero?
      end
      s
    end

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
            #  File has been deleted so deleting the file later is useless'
            Thread.exit
          end
        end
        f = File.new("public/#{file_name}")
        new_creation_time = f.ctime
        if creation_time == new_creation_time
          File.delete("public/" + file_name) if File.exists?("public/" + file_name)
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
        # prev_peroid = nil -> user has 1 assessment only and this counts as an improvement
        next if prev_period.present? && title.rank <= prev_period[:rank]
        prev_period ||= {}
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
      # results = {}
      # temp_users = [{ full_name: "Nguyen Van A", email: "nguyenvana@gmail.com", rank: 2, level: 1, title: "Title 2-1", rank_prev: 1, level_prev: 2, title_prev: "Title 1-2" },
      #               { full_name: "Nguyen Van B", email: "nguyenvanb@gmail.com", rank: 2, level: 2, title: "Title 2-2", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #               { full_name: "Nguyen Van C", email: "nguyenvanc@gmail.com", rank: 3, level: 2, title: "Title 3-2", rank_prev: 2, level_prev: 1, title_prev: "Title 2-1" },
      #               { full_name: "Nguyen Van D", email: "nguyenvand@gmail.com", rank: 4, level: 2, title: "Title 4-2", rank_prev: 3, level_prev: 1, title_prev: "Title 3-1" },
      #               { full_name: "Nguyen Van E", email: "nguyenvane@gmail.com", rank: 2, level: 5, title: "Title 2-5", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #               { full_name: "Nguyen Van F", email: "nguyenvanf@gmail.com", rank: 2, level: 3, title: "Title 2-3", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #               { full_name: "Nguyen Van G", email: "nguyenvang@gmail.com", rank: 4, level: 1, title: "Title 3-1", rank_prev: 3, level_prev: 1, title_prev: "Title 3-1" },
      #               { full_name: "Nguyen Van H", email: "nguyenvanha@gmail.com", rank: 2, level: 2, title: "Title 2-2", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" },
      #               { full_name: "Nguyen Van I", email: "nguyenvani@gmail.com", rank: 2, level: 3, title: "Title 2-3", rank_prev: 1, level_prev: 1, title_prev: "Title 1-1" }]
      # results[3] = {}
      # results[3][:users] = temp_users
      # results[3][:company_name] = h_companies[3]
      # results[3][:period] = 50
      # results[3][:prev_period] = 40
      # results[3][:period_excel_name] = "20200901"
      # results[3][:period_name] = "09/2020"
      # results[3][:period_prev_name] = "02/2020"

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
        next if prev_period.nil? || title.rank >= prev_period[:rank]

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

      # results = {}
      # temp_users = [{ full_name: "Nguyen Duc A", email: "nguyenduca@gmail.com", rank_prev: 2, level_prev: 1, title_prev: "Title 2-1", rank: 1, level: 2, title: "Title 1-2" },
      #               { full_name: "Nguyen Duc B", email: "nguyenducb@gmail.com", rank_prev: 2, level_prev: 2, title_prev: "Title 2-2", rank: 1, level: 1, title: "Title 1-1" },
      #               { full_name: "Nguyen Duc C", email: "nguyenducc@gmail.com", rank_prev: 3, level_prev: 2, title_prev: "Title 3-2", rank: 2, level: 1, title: "Title 2-1" },
      #               { full_name: "Nguyen Duc D", email: "nguyenducd@gmail.com", rank_prev: 4, level_prev: 2, title_prev: "Title 4-2", rank: 3, level: 1, title: "Title 3-1" },
      #               { full_name: "Nguyen Duc E", email: "nguyenduce@gmail.com", rank_prev: 2, level_prev: 5, title_prev: "Title 2-5", rank: 1, level: 1, title: "Title 1-1" },
      #               { full_name: "Nguyen Duc F", email: "nguyenducf@gmail.com", rank_prev: 2, level_prev: 3, title_prev: "Title 2-3", rank: 1, level: 1, title: "Title 1-1" },
      #               { full_name: "Nguyen Duc G", email: "nguyenducg@gmail.com", rank_prev: 4, level_prev: 1, title_prev: "Title 3-1", rank: 3, level: 1, title: "Title 3-1" },
      #               { full_name: "Nguyen Duc H", email: "nguyenducha@gmail.com", rank_prev: 2, level_prev: 2, title_prev: "Title 2-2", rank: 1, level: 1, title: "Title 1-1" },
      #               { full_name: "Nguyen Duc I", email: "nguyenduci@gmail.com", rank_prev: 2, level_prev: 3, title_prev: "Title 2-3", rank: 1, level: 1, title: "Title 1-1" }]
      # results[3] = {}
      # results[3][:users] = temp_users
      # results[3][:company_name] = h_companies[3]
      # results[3][:period] = 50
      # results[3][:prev_period] = 40
      # results[3][:period_excel_name] = "20200901"
      # results[3][:period_name] = "09/2020"
      # results[3][:period_prev_name] = "02/2020"

      # temp_users = [{ full_name: "Nguyen Minh A", email: "nguyenduca@gmail.com", rank_prev: 2, level_prev: 1, title_prev: "Title 2-1", rank: 1, level: 2, title: "Title 1-2" },
      #               { full_name: "Nguyen Minh B", email: "nguyenducb@gmail.com", rank_prev: 2, level_prev: 2, title_prev: "Title 2-2", rank: 1, level: 1, title: "Title 1-1" },
      #               { full_name: "Nguyen Minh C", email: "nguyenducc@gmail.com", rank_prev: 3, level_prev: 2, title_prev: "Title 3-2", rank: 2, level: 1, title: "Title 2-1" },
      #               { full_name: "Nguyen Minh D", email: "nguyenducd@gmail.com", rank_prev: 4, level_prev: 2, title_prev: "Title 4-2", rank: 3, level: 1, title: "Title 3-1" },
      #               { full_name: "Nguyen Minh E", email: "nguyenduce@gmail.com", rank_prev: 2, level_prev: 5, title_prev: "Title 2-5", rank: 1, level: 1, title: "Title 1-1" }]
      # results[2] = {}
      # results[2][:users] = temp_users
      # results[2][:company_name] = h_companies[2]
      # results[2][:period] = 50
      # results[2][:prev_period] = 40
      # results[2][:period_excel_name] = "20200901"
      # results[2][:period_name] = "09/2020"
      # results[2][:period_prev_name] = "02/2020"

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

      # results = {}
      # temp_users = [{ full_name: "Le Khac A", email: "lekhaca@gmail.com", rank: 2, level: 1, title: "Title 2-1", period_from_name: "02/2020" },
      #               { full_name: "Le Khac B", email: "lekhacb@gmail.com", rank: 2, level: 2, title: "Title 2-2", period_from_name: "02/2020" },
      #               { full_name: "Le Khac C", email: "lekhacc@gmail.com", rank: 3, level: 2, title: "Title 3-2", period_from_name: "08/2019" },
      #               { full_name: "Le Khac D", email: "lekhacd@gmail.com", rank: 4, level: 2, title: "Title 4-2", period_from_name: "08/2019" },
      #               { full_name: "Le Khac E", email: "lekhace@gmail.com", rank: 2, level: 5, title: "Title 2-5", period_from_name: "08/2019" },
      #               { full_name: "Le Khac F", email: "lekhacf@gmail.com", rank: 2, level: 3, title: "Title 2-3", period_from_name: "08/2019" },
      #               { full_name: "Le Khac G", email: "lekhacg@gmail.com", rank: 4, level: 1, title: "Title 3-1", period_from_name: "02/2020" },
      #               { full_name: "Le Khac H", email: "lekhaca@gmail.com", rank: 2, level: 2, title: "Title 2-2", period_from_name: "02/2020" },
      #               { full_name: "Le Khac I", email: "lekhaci@gmail.com", rank: 2, level: 3, title: "Title 2-3", period_from_name: "02/2019" }]
      # results[3] = {}
      # results[3][:users] = temp_users
      # results[3][:company_name] = h_companies[3]
      # results[3][:period_excel_name] = "20200901"
      # results[3][:period_name] = "09/2020"

      { data: results }
    end

    def export_excel_CDS_CDP(template_id, extension)
      # this function will generate CDS_CDP of users
      # return filename on excel creation success
      # and nil if template doesn't exist
      begin
        current_template = Template.find(template_id)
      rescue
        return nil
      end

      package = Axlsx::Package.new
      workbook = package.workbook

      format1 = workbook.styles.add_style(:sz => 15, :fg_color => "9A284C", :font_name => "Arial", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
      format2 = workbook.styles.add_style(:sz => 10, :fg_color => "000000", :bg_color => "CCCCCC", :font_name => "Arial", :b => true, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
      format3 = workbook.styles.add_style(:sz => 10, :fg_color => "0202FF", :bg_color => "FFFFFF", :font_name => "Arial", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
      format4 = workbook.styles.add_style(:sz => 10, :fg_color => "000000", :bg_color => "DDDDDD", :font_name => "Arial", :b => true, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
      format5 = workbook.styles.add_style(:sz => 10, :fg_color => "000000", :bg_color => "FFFFFF", :font_name => "Arial", :b => true, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })
      format6 = workbook.styles.add_style(:sz => 10, :fg_color => "000000", :bg_color => "FFFFFF", :font_name => "Arial", :b => false, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right] }, :alignment => { :horizontal => :left, :vertical => :top, :wrap_text => :true })

      # create cds sheet
      cds_sheet = workbook.add_worksheet(:name => "CDS")
      cds_sheet.add_row [""]
      cds_sheet.add_row ["Bảng Cam Kết Năng Lực Của Nhân Viên", ""], :style => format1
      cds_sheet.merge_cells "A2:B2"
      cds_sheet.add_row ["Name / Họ tên", "", "<First Name> <Last Name>-<Middle Name>"]
      cds_sheet.rows[2].cells[0].style = format2
      cds_sheet.rows[2].cells[1].style = format2
      cds_sheet.rows[2].cells[2].style = format3
      cds_sheet.merge_cells "A3:B3"

      cds_sheet.add_row ["Title / Cấp bậc hiện tại", ""], :style => format2
      cds_sheet.rows[3].cells[0].style = format2
      cds_sheet.rows[3].cells[1].style = format2

      cds_sheet.merge_cells "A4:B4"

      cds_sheet.add_row ["Staff number (If have) / Số lượng nhân viên quản lý hiện tại ( nếu có)", ""], :style => format2
      cds_sheet.rows[4].cells[0].style = format2
      cds_sheet.rows[4].cells[1].style = format2
      cds_sheet.merge_cells "A5:B5"

      cds_sheet.add_row [""]

      cds_sheet.add_row ["#", "CDS Competency Metrics", "Assessment Guidelines / Hướng dẫn", "State of slots / Trạng thái của từng slot", "Output / Kết quả thực hiện ứng viên tự đánh giá"], :style => format2
      cds_sheet.add_row ["", "", "", "", "Staff / Nhân viên", "", "", "Line Manager / Quản lý trực tiếp", "", ""]

      cds_sheet.rows[7].cells[4].style = format4
      cds_sheet.rows[7].cells[5].style = format4
      cds_sheet.rows[7].cells[6].style = format4
      cds_sheet.rows[7].cells[7].style = format4
      cds_sheet.rows[7].cells[8].style = format4
      cds_sheet.rows[7].cells[9].style = format4

      cds_sheet.merge_cells "E7:J7"

      cds_sheet.merge_cells "E8:G8"
      cds_sheet.merge_cells "H8:I8"

      cds_sheet.add_row ["", "", "", "", "Self assessment / Tự đánh giá", "To exhibit a piece of evidence / Bằng chứng kèm theo", "Score point of slots / Điểm số đạt được từng slot", "Recommend / Nhận xét", "Assessment / Kết quả", "Score point of slots /  Điểm số đạt được từng slot"]

      cds_sheet.rows[8].cells[0].style = format2
      cds_sheet.rows[8].cells[1].style = format2
      cds_sheet.rows[8].cells[2].style = format2
      cds_sheet.rows[8].cells[3].style = format2

      cds_sheet.rows[8].cells[4].style = format5
      cds_sheet.rows[8].cells[5].style = format5
      cds_sheet.rows[8].cells[6].style = format5
      cds_sheet.rows[8].cells[7].style = format5
      cds_sheet.rows[8].cells[8].style = format5
      cds_sheet.rows[8].cells[9].style = format5

      cds_sheet.rows[8].height = 30

      cds_sheet.merge_cells "A7:A8"
      cds_sheet.merge_cells "B7:B8"
      cds_sheet.merge_cells "C7:C8"
      cds_sheet.merge_cells "D7:D8"

      cds_sheet.sheet_view.pane do |pane|
        pane.top_left_cell = "C3"
        pane.state = :frozen
        pane.x_split = 2
        pane.y_split = 1
        pane.active_pane = :bottom_right
      end
      # convert to array to prevent additional query
      competencies = Competency.select(:id, :name).joins(:template).where("templates.id=?", template_id).order(:_type).to_a
      all_levels = Competency.select(:id, :level, :"slots.evidence", :"slots.desc").joins(:slots).order(:location, :level, :"slots.slot_id").to_a
      competencies.each_with_index do |competency, index|
        roman_index = roman(index + 1)
        roman_name = competency.name
        cds_sheet.add_row [roman_index, roman_name, "", "", "", "", "", "", "", ""], :style => format4

        row_id = cds_sheet.rows.length
        cell_id = "E#{row_id}"
        cds_sheet.add_data_validation(cell_id, {
          :type => :list,
          :formula1 => '"Rất tốt, Tốt, Đạt yêu cầu, Chưa đạt yêu cầu, Chưa có cơ hội thực hiện, Không biết làm"',
          :showDropDown => false,
          :showInputMessage => true,
          :promptTitle => "",
          :prompt => "",
        })

        row_id = cds_sheet.rows.length
        cell_id = "I#{row_id}:J#{row_id}"
        cds_sheet.add_data_validation(cell_id, {
          :type => :list,
          :formula1 => '"Rất tốt, Tốt, Đạt yêu cầu, Chưa đạt yêu cầu, Chưa có cơ hội thực hiện, Không biết làm"',
          :showDropDown => false,
          :showInputMessage => true,
          :promptTitle => "",
          :prompt => "",
        })

        # get level from current iterated competency
        levels = all_levels.collect { |c| c[:level].to_i if c.id == competency.id }.uniq.compact
        # get slot data from current iterated competency
        all_slot_levels = all_levels.collect { |c| c if c.id == competency.id }.compact
        levels.each do |level|
          cds_sheet.add_row ["", "Level #{level}", "", "", "", "", "", "", "", ""], :style => format5

          row_id = cds_sheet.rows.length
          cell_id = "E#{row_id}"
          cds_sheet.add_data_validation(cell_id, {
            :type => :list,
            :formula1 => '"Rất tốt, Tốt, Đạt yêu cầu, Chưa đạt yêu cầu, Chưa có cơ hội thực hiện, Không biết làm"',
            :showDropDown => false,
            :showInputMessage => true,
            :promptTitle => "",
            :prompt => "",
          })

          row_id = cds_sheet.rows.length
          cell_id = "I#{row_id}:J#{row_id}"
          cds_sheet.add_data_validation(cell_id, {
            :type => :list,
            :formula1 => '"Rất tốt, Tốt, Đạt yêu cầu, Chưa đạt yêu cầu, Chưa có cơ hội thực hiện, Không biết làm"',
            :showDropDown => false,
            :showInputMessage => true,
            :promptTitle => "",
            :prompt => "",
          })

          slot_this_level = all_slot_levels.collect { |c| c if c[:level].to_i == level }.compact
          slot_this_level.each_with_index do |s, index|
            final_name = squish_keep_newline(s.desc)
            final_desc = squish_keep_newline(s.evidence)
            final_desc_with_HTML = ActionView::Base.full_sanitizer.sanitize(final_desc)
            #final_desc_with_HTML = from_HTML_to_axlsx_text(final_desc)
            final_level = s[:level] + alph(index + 1)
            cds_sheet.add_row [final_level, final_name, final_desc_with_HTML, "Commit", "Commit", "", "", "", "", ""], :style => format6

            row_id = cds_sheet.rows.length
            cell_id = "D#{row_id}:E#{row_id}"

            cds_sheet.add_data_validation(cell_id, {
              :type => :list,
              :formula1 => '"Commit, Uncommit"',
              :showDropDown => false,
              :showInputMessage => true,
              :promptTitle => "",
              :prompt => "",
            })

            cell_id = "E#{row_id}"
            cds_sheet.add_data_validation(cell_id, {
              :type => :list,
              :formula1 => '"Outstanding, Exceeds Expectations, Meets Expectations, Needs Improvement, Does Not Meet Minimum Standards, N/A"',
              :showDropDown => false,
              :showInputMessage => true,
              :promptTitle => "",
              :prompt => "",
            })

            cell_id = "I#{row_id}"
            cds_sheet.add_data_validation(cell_id, {
              :type => :list,
              :formula1 => '"Outstanding, Exceeds Expectations, Meets Expectations, Needs Improvement, Does Not Meet Minimum Standards, N/A"',
              :showDropDown => false,
              :showInputMessage => true,
              :promptTitle => "",
              :prompt => "",
            })

            height = [calculate_height(final_desc), calculate_height(final_name)].max
            cds_sheet.rows[-1].height = height
          end
        end
      end

      # create cdp sheet
      cdp_sheet = workbook.add_worksheet(:name => "CDP")

      cdp_sheet.add_row [""]
      cdp_sheet.add_row ["Bảng Cam Kết Năng Lực Của Nhân Viên", ""], :style => format1
      cdp_sheet.merge_cells "A2:B2"
      cdp_sheet.add_row ["Name / Họ tên", "", "<First Name> <Last Name>-<Middle Name>"]
      cdp_sheet.rows[2].cells[0].style = format2
      cdp_sheet.rows[2].cells[1].style = format2
      cdp_sheet.rows[2].cells[2].style = format3
      cdp_sheet.merge_cells "A3:B3"

      cdp_sheet.add_row ["Title / Cấp bậc hiện tại", ""], :style => format2
      cdp_sheet.rows[3].cells[0].style = format2
      cdp_sheet.rows[3].cells[1].style = format2

      cdp_sheet.merge_cells "A4:B4"

      cdp_sheet.add_row ["Staff number (If have) / Số lượng nhân viên quản lý hiện tại ( nếu có)", ""], :style => format2
      cdp_sheet.rows[4].cells[0].style = format2
      cdp_sheet.rows[4].cells[1].style = format2
      cdp_sheet.merge_cells "A5:B5"

      cdp_sheet.add_row [""]

      cdp_sheet.add_row ["#", "CDS Competency Metrics", "Assessment Guidelines / Hướng dẫn", "Cam kết của Nhân  viên", "Cam kết của QLTT", "Ghi chú"], :style => format2

      cdp_sheet.add_row [""]

      cdp_sheet.merge_cells "A7:A8"
      cdp_sheet.merge_cells "B7:B8"
      cdp_sheet.merge_cells "C7:C8"
      cdp_sheet.merge_cells "D7:D8"
      cdp_sheet.merge_cells "E7:E8"
      cdp_sheet.merge_cells "F7:F8"

      cdp_sheet.sheet_view.pane do |pane|
        pane.top_left_cell = "C3"
        pane.state = :frozen
        pane.x_split = 2
        pane.y_split = 1
        pane.active_pane = :bottom_right
      end

      competencies.each_with_index do |competency, index|
        roman_index = roman(index + 1)
        roman_name = competency.name
        cdp_sheet.add_row [roman_index, roman_name, "", "", "", ""], :style => format4
        # get level from current iterated competency
        levels = all_levels.collect { |c| c[:level].to_i if c.id == competency.id }.uniq.compact
        # get slot data from current iterated competency
        all_slot_levels = all_levels.collect { |c| c if c.id == competency.id }.compact
        levels.each do |level|
          cdp_sheet.add_row ["", "Level #{level}", "", "", "", ""], :style => format5

          row_id = cdp_sheet.rows.length
          cell_id = "D#{row_id}:E#{row_id}"

          cdp_sheet.add_data_validation(cell_id, {
            :type => :list,
            :formula1 => '"Commit, Uncommit"',
            :showDropDown => false,
            :showInputMessage => true,
            :promptTitle => "",
            :prompt => "",
          })

          slot_this_level = all_slot_levels.collect { |c| c if c[:level].to_i == level }.compact
          slot_this_level.each_with_index do |s, index|
            final_name = squish_keep_newline(s.desc)
            final_desc = squish_keep_newline(s.evidence)
            #final_desc_with_HTML = from_HTML_to_axlsx_text(final_desc)
            final_desc_with_HTML = ActionView::Base.full_sanitizer.sanitize(final_desc)
            final_level = s[:level] + alph(index + 1)
            cdp_sheet.add_row [final_level, final_name, final_desc_with_HTML, "Commit", "Commit", ""], :style => format6
            height = [calculate_height(final_desc), calculate_height(final_name)].max
            cdp_sheet.rows[-1].height = height
          end
        end
      end

      cds_sheet.column_widths 5, 90, 90 # run at last
      cdp_sheet.column_widths 5, 90, 90 # run at last

      template_name = current_template.name.gsub(/[\/\\ ]+/, "_")

      # If OTS then create a different xlsx file
      # so as not to delete existing xlsx file
      if extension.downcase == "ots"
        xlsx_name = "public/temp.xlsx"
      else
        xlsx_name = "public/cds_cdp_template_#{template_name}.xlsx"
      end
      package.serialize(xlsx_name)
      if extension.downcase == "ots"
        ots_name = "public/cds_cdp_template_#{template_name}.ots"
        Libreconv.convert(xlsx_name, ots_name, nil, "ots")
        File.delete(xlsx_name) if File.exist?(xlsx_name)
        File.basename(ots_name)
      elsif extension.downcase == "xlsx"
        File.basename(xlsx_name)
      end
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
        level_up_sheet.column_widths 5, 30, 30, 32, 5, 5, 32, 5, 5, 30 # run at last
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
        level_down_sheet.column_widths 5, 30, 30, 32, 5, 5, 32, 5, 5, 30 # run at last
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
        no_change_sheet.column_widths 5, 30, 30, 32, 5, 5, 32, 5, 5, 30 # run at last
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
        title_comparison_sheet.column_widths 5, 30, 30, 32, 5, 5, 32, 5, 5, 30 # run at last
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
