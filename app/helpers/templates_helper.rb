module TemplatesHelper
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

    def roman(n)
        roman = ""
        ROMAN_NUMBERS.each do |value, letter|
        roman << letter*(n / value)
        n = n % value
        end
        return roman
    end

    def export_excel_CDS_CDP(template_id, extension)
        # this function will generate CDS_CDP of users
        # return true on excel creation success
        # and false on failure

        begin
            current_template = Template.find(template_id)            
        rescue 
            return nil
        end
        
        package = Axlsx::Package.new         
        workbook = package.workbook
        
        format1 = workbook.styles.add_style(:sz=>15,  :fg_color => "9A284C", :font_name => "Arial", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right]}\
        ,:alignment => {:horizontal => :left, :vertical => :top, :wrap_text => :true})
        format2 = workbook.styles.add_style(:sz=>10,  :fg_color => "000000", :bg_color => "CCCCCC", :font_name => "Arial", :b => true, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right]}\
        ,:alignment => {:horizontal => :left, :vertical => :top, :wrap_text => :true})
        format3 = workbook.styles.add_style(:sz=>10,  :fg_color => "0202FF", :bg_color => "FFFFFF", :font_name => "Arial", :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right]}\
        ,:alignment => {:horizontal => :left, :vertical => :top, :wrap_text => :true})
        format4 = workbook.styles.add_style(:sz=>10,  :fg_color => "000000", :bg_color => "DDDDDD", :font_name => "Arial", :b => true, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right]}\
        ,:alignment => {:horizontal => :left, :vertical => :top, :wrap_text => :true})
        format5 = workbook.styles.add_style(:sz=>10,  :fg_color => "000000", :bg_color => "FFFFFF",:font_name => "Arial", :b => true, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right]}\
        ,:alignment => {:horizontal => :left, :vertical => :top, :wrap_text => :true})
        format6 = workbook.styles.add_style(:sz=>10, :fg_color => "000000", :bg_color => "FFFFFF",:font_name => "Arial", :b => false, :border => { :style => :thin, :color => "000000", :edges => [:top, :bottom, :left, :right]}\
        , :alignment => {:horizontal => :left, :vertical => :top, :wrap_text => :true})
                
        # create cds sheet
        cds_sheet = workbook.add_worksheet(:name => "CDS") 
        cds_sheet.add_row [""]
        cds_sheet.add_row ["Bảng Cam Kết Năng Lực Của Nhân Viên", ""] , :style => format1
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
        
        cds_sheet.add_row ["#", "CDS Competency Metrics" , "Assessment Guidelines / Hướng dẫn", "State of slots / Trạng thái của từng slot", "Output / Kết quả thực hiện ứng viên tự đánh giá"], :style => format2
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
        
        cds_sheet.add_row ["", "", "", "",  "Self assessment / Tự đánh giá", "To exhibit a piece of evidence / Bằng chứng kèm theo", "Score point of slots / Điểm số đạt được từng slot", \
        "Recommend / Nhận xét", "Out / Kết quả", "Score point of slots /  Điểm số đạt được từng slot"]

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
        
        # convert to array to prevent additional query
        competencies = Competency.select(:id, :name).joins(:template).where("templates.id=?", template_id).order(:_type).to_a
        all_levels   = Competency.joins(:slots).order(:level => :asc).select(:id, :level, :"slots.desc", :"slots.name").to_a

        competencies.each_with_index{|competency, index|
            roman_index = roman(index+1)
            roman_name = competency.name
            cds_sheet.add_row [roman_index, roman_name, "", "", "", "", "", "", "", ""], :style => format4
            levels = all_levels.collect{|c| c.level.to_i if c.id == competency.id}.uniq.compact
            all_slot_levels = all_levels.collect{|c| c if c.id == competency.id}.compact            
            levels.each{|level|
                cds_sheet.add_row ["", "Level #{level}", "", "", "", "", "", "", "", ""], :style => format5                
                slot_this_level = all_slot_levels.collect{|c| c if c.level.to_i == level}.compact
                slot_this_level.each{|s|
                    final_name = s.name.squish
                    final_desc = s.desc.squish                    
                    cds_sheet.add_row [s.level, final_name, final_desc, "Commit", "Commit", "", "", "", "", ""], :style => format6
                    height = [((final_desc.length / 100)+3) * 10, ((final_name.length / 100)+3) * 10].max
                    cds_sheet.rows[-1].height = height
                }
            }
        }

        # create cdp sheet
        cdp_sheet = workbook.add_worksheet(:name => "CDP") 
        
        cdp_sheet.add_row [""]
        cdp_sheet.add_row ["Bảng Cam Kết Năng Lực Của Nhân Viên", ""] , :style => format1
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
        
        cdp_sheet.add_row ["#", "CDS Competency Metrics" , "Assessment Guidelines / Hướng dẫn", "Cam kết của Nhân  viên", "Cam kết của QLTT", "Ghi chú"], :style => format2

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
        
        
        competencies.each_with_index{|competency, index|
            roman_index = roman(index+1)
            roman_name = competency.name
            cdp_sheet.add_row [roman_index, roman_name, "", "", "", ""], :style => format4
            levels = all_levels.collect{|c| c.level.to_i if c.id == competency.id}.uniq.compact
            all_slot_levels = all_levels.collect{|c| c if c.id == competency.id}.compact            
            levels.each{|level|
                cdp_sheet.add_row ["", "Level #{level}", "", "", "", ""], :style => format5
                slot_this_level = all_slot_levels.collect{|c| c if c.level.to_i == level}.compact
                slot_this_level.each{|s|
                    final_name = s.name.squish
                    final_desc = s.desc.squish                    
                    cdp_sheet.add_row [s.level, final_name, final_desc, "Commit", "Commit", ""], :style => format6
                    height = [((final_desc.length / 100)+3) * 10, ((final_name.length / 100)+3) * 10].max
                    cdp_sheet.rows[-1].height = height
                }
            }
        }
        
        cds_sheet.column_widths 5 , 90 # run at last
        cdp_sheet.column_widths 5 , 90 # run at last

        template_name = current_template.name.gsub(/[\/\\]+/, "_")
        xlsx_name  = "public/cds_cdp_template_#{template_name}.xlsx"        
        package.serialize(xlsx_name)        

        if extension.downcase == "ots"
            ots_name  = "public/cds_cdp_template_#{template_name}.ots"        
            Libreconv.convert(xlsx_name, ots_name, nil, 'ots')            
            File.delete(xlsx_name) if File.exist?(xlsx_name)
            File.basename(ots_name)
            
        elsif extension.downcase == "xlsx"            
            File.basename(xlsx_name)
        end
                
    end

    def sortable(column, title = nil)
      title ||= column.titleize
      direction = (column == sort_column && sort_direction == "asc") ? "desc" : "asc"
      link_to title, {sort: column, direction: direction}, {class: "sort-header"}
    end
end