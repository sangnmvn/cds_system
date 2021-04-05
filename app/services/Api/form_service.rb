module Api
  class FormService < BaseService
    REVIEW_CDS = 16
    APPROVE_CDS = 17
    FULL_ACCESS = 24
    FULL_ACCESS_MY_COMPANY = 27
    HIGH_FULL_ACCESS = 26
    Time::DATE_FORMATS[:custom_datetime] = "%d/%m/%Y"

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

    def get_competencies(form_id = nil)
      return get_old_competencies if params[:title_history_id].present?
      if form_id.present?
        form = Form.find_by_id(form_id)
      else
        form = Form.find_by(user_id: current_user.id, is_delete: false)
      end
      return false if form.nil?
      slots = Slot.distinct(:id).includes(:competency).joins(:form_slots).where(form_slots: { form_id: form.id }).order(:competency_id, :level, :slot_id).group(:id)
      slots = slots.where(level: params[:level]) if params[:level].present?
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: form.id, slot_id: slots.pluck(:id)).order("line_managers.id desc", "comments.updated_at desc")
      form_slots = get_point_for_result(form_slots)
      result = preview_result(form)

      competencies = Competency.includes(:slots).where(template_id: form.template_id)
      hash = {}
      competencies.each do |competency|
        hash[competency.name] = {
          type: competency.sort_type,
          id: competency.id,
          levels: {},
          level_point: calculate_level(result[competency.name]) || "N/A",
        }
        competency.slots.group("slots.level").count.each do |key, value|
          hash[competency.name][:levels][key] = {
            total: value,
            current: 0,
          }
        end
      end

      slots.map do |slot|
        data = form_slots[slot.id]
        next if data.nil?
        value = data[:final_point] || data[:point]
        value = data[:point] if data[:is_change]
        if current_user.id != form.user_id
          if privilege_array.include?(REVIEW_CDS)
            value = data[:recommends][current_user.id][:given_point] unless data[:recommends] || data[:recommends][current_user.id]
          elsif (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?
            value = data[:final_point] || value
          end
        end
        hash[slot.competency.name][:levels][slot.level][:current] += 1 if value > 2
      end

      hash
    end

    def get_slot_change
      form_slots = FormSlot.includes(:slot).where(is_change: true, form_id: params[:form_id])
      arr = Array.new

      form_slots.each { |form_slot|
        arr << {
          slot_id: form_slot.slot.id,
          competency_id: form_slot.slot.competency_id,
          level: form_slot.slot.level.to_i - 1,
        }
      }
      arr
    end

    def get_is_requested
      form_slots = FormSlot.includes(:comments).where(form_id: params[:form_id])
      form_slots.each do |form_slot|
        return "success" if form_slot.comments.where(flag: "orange").count > 0
      end
      "fail"
    end

    def get_summary_comment
      form = Form.find_by(id: params[:form_id])
      summary_comments = SummaryComment.where(form_id: params[:form_id]).order(updated_at: :desc, period_id: :desc)
      data_comment = []
      summary_comments.map do |summary_comment|
        data_comment << {
          id: summary_comment.id,
          period: summary_comment.period.format_name,
          user_name: summary_comment.user.account,
          comment_date: summary_comment.updated_at.to_s(:custom_datetime),
          comment: summary_comment.comment,
          status: (form.user_id != current_user.id) &&
                  (summary_comment.line_manager_id == current_user.id) &&
                  (summary_comment.period_id == form.period_id) ? true : false,
        }
      end
      data_comment
    end

    def save_summary_comment
      summary_comment = SummaryComment.where(id: params[:summary_id]).first
      if summary_comment.present?
        return false unless summary_comment.update(comment: params[:comment])
      else
        form = Form.find_by(id: params[:form_id])
        return false unless form.present? && SummaryComment.create!(period_id: form.period_id, line_manager_id: current_user.id,
                                                                    form_id: form.id, comment: params[:comment])
      end
      true
    end

    def confirm_request
      user_of_form = Form.includes(:user).find_by(id: params[:form_id])
      approver = Approver.find_by(user_id: user_of_form.user_id, is_approver: true, period_id: user_of_form.period_id)
      reviewer = ""
      form_slot_ids = {}
      if user_of_form.user.id == current_user.id #check staff or reviewer
        #form slot have comment_flag_yellows
        comments = Comment.includes(:form_slot).
          where(form_slots: { form_id: params[:form_id] }, flag: "yellow", is_delete: false)
        form_slot_id_in_comments = comments.pluck(:form_slot_id).uniq
        #line manager have orange flag
        form_slot_ids = LineManager.includes(:form_slot).
          where(form_slots: { form_id: params[:form_id] }, flag: "orange", period_id: user_of_form.period_id,
                form_slot_id: form_slot_id_in_comments)
        reviewer = User.joins(:approvers).where("approvers.user_id": current_user.id).
          where("approvers.is_approver": false, "approvers.period_id": user_of_form.period_id).pluck(:account, :email)
      else
        form_slot_id_of_current_users = LineManager.includes(:form_slot).
          where(form_slots: { form_id: params[:form_id] }, flag: "#99FF33", period_id: user_of_form.period_id).
          pluck(:form_slot_id).uniq
        #line manager have orange flag
        form_slot_ids = LineManager.includes(:form_slot).
          where(form_slots: { form_id: params[:form_id] }, flag: "orange",
                form_slot_id: form_slot_id_of_current_users, user_id: approver.approver_id, period_id: user_of_form.period_id)
        reviewer = User.where(id: approver.approver_id).pluck(:account, :email)
      end
      old_comment = Comment.includes(:form_slot).where(form_slots: { form_id: params[:form_id] }, is_delete: true)
      old_comment.destroy_all if old_comment.present?
      if form_slot_ids.present?
        comments.update(re_update: false)
        period = Form.includes(:period).find(params[:form_id]).period
        form_slots = FormSlot.includes(slot: [:competency]).
          where(id: form_slot_ids.pluck(:form_slot_id).uniq)
        location_slots = get_location_slot(form_slots.pluck("competencies.id").uniq)
        customize_slots = {}
        form_slots.map do |form_slot|
          key = form_slot.slot.competency.name
          customize_slots[key] = [] if customize_slots[key].nil?
          customize_slots[key] << location_slots[form_slot.slot.id]
        end
        Async.await do
          CdsAssessmentMailer.with(user_name: user_of_form.user.account, current_user: current_user.account, from_date: period.from_date, to_date: period.to_date, reviewers: reviewer, slots: customize_slots).user_add_more_evidence.deliver_later(wait: 5.seconds)
        end
        return "success"
      end
      "fail"
    end

    def re_assessment_passed_slot
      formslot = FormSlot.where(form_id: params[:form_id], slot_id: params[:slot_id]).first
      return "success" if formslot.update(is_change: true)
      "fail"
    end

    def get_location_slot(competency_ids)
      hash_position = {}
      h_competency = {}
      Slot.includes(:competency).where(competency_id: competency_ids).order("competencies.location", :level).each do |slot|
        if h_competency[slot.competency_id].nil?
          h_level = {}
          h_level[slot.level] = 0
          h_competency[slot.competency_id] = h_level
        elsif h_competency[slot.competency_id][slot.level].nil?
          h_competency[slot.competency_id][slot.level] = 0
        end
        hash_position[slot.id] = slot.level + LETTER_CAP[h_competency[slot.competency_id][slot.level]]
        h_competency[slot.competency_id][slot.level] += 1
      end
      hash_position
    end

    def get_old_competencies
      competency_ids = FormSlotHistory.where(title_history_id: params[:title_history_id]).pluck(:competency_id).uniq
      competencies = Competency.where(id: competency_ids)
      hash = {}
      competencies.map do |competency|
        hash[competency.name] = {
          type: competency.sort_type,
          id: competency.id,
          levels: {},
        }
      end
      hash
    end

    def reset_all_approver_submit_status(user_id)
      all_approver_save = true
      approver_to_reset = Approver.where(user_id: user_id)
      approver_to_reset.each do |approver|
        approver.is_submit_cds = 0
        approver.is_submit_cdp = 0
        all_approver_save &&= approver.save
      end
      all_approver_save
    end

    def create_form_slot(form = nil)
      role_id = current_user.role_id
      template_id = Template.find_by(role_id: role_id, status: true)&.id
      return 0 if template_id.nil?

      competency_ids = Competency.where(template_id: template_id).order(:location).pluck(:id)
      slot_ids = Slot.where(competency_id: competency_ids).order(:level, :slot_id).pluck(:id)

      form ||= Form.new(user_id: current_user.id, template_id: template_id, role_id: role_id, status: "New", is_delete: false)

      all_approver_save = reset_all_approver_submit_status(current_user.id)
      if form.save && all_approver_save
        slot_ids.map do |id|
          FormSlot.create!(form_id: form.id, slot_id: id, is_passed: 0)
        end
      end

      form
    end

    def get_list_cds_review
      filter = filter_cds_review_list
      period_first = []
      period_none_first = []

      if filter[:period_id].count > 1
        period_first = filter[:period_id].first
        period_none_first = filter[:period_id][1..-1]
      else
        period_first = filter[:period_id]
      end
      user_ids = User.where(filter[:filter_users]).pluck(:id)
      user_ids = User.where(id: user_ids, company_id: current_user.company_id).pluck(:id) if (@privilege_array.include? FULL_ACCESS_MY_COMPANY) && !(@privilege_array.include? FULL_ACCESS)
      user_ids = ProjectMember.where(project_id: filter[:project_id], user_id: user_ids).pluck(:user_id).uniq if filter[:project_id].present?
      if (period_first)
        user_approve_ids = Approver.where(approver_id: current_user.id, user_id: user_ids, is_approver: true, period_id: period_first).select(:user_id)
        reviewers = Approver.where(approver_id: current_user.id, user_id: user_ids, is_approver: false, period_id: period_first)
      else
        user_approve_ids = Approver.where(approver_id: current_user.id, user_id: user_ids, is_approver: true).select(:user_id)
        reviewers = Approver.where(approver_id: current_user.id, user_id: user_ids, is_approver: false)
      end
      h_reviewers = {}
      reviewers.each do |reviewer|
        h_reviewers[reviewer.user_id] = reviewer.is_submit_cds
      end
      user_review_ids = reviewers.pluck(:user_id)
      forms = []
      if (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?
        forms += if (period_first)
            Form.includes(:period, :role, :title).where(user_id: user_approve_ids, period_id: period_first,
                                                        status: ["Awaiting Approval", "Done"])
              .offset(params[:offset]).order(id: :desc)
          else
            Form.includes(:period, :role, :title).where(user_id: user_approve_ids, status: ["Awaiting Approval", "Done"])
              .offset(params[:offset]).order(id: :desc)
          end
      end
      if (@privilege_array & [REVIEW_CDS, HIGH_FULL_ACCESS]).any?
        forms += if (period_first)
            Form.includes(:period, :role, :title).where(user_id: user_review_ids, period_id: period_first)
              .where.not(status: ["New"]).offset(params[:offset]).order(id: :desc)
          else
            Form.includes(:period, :role, :title).where(user_id: user_review_ids)
              .where.not(status: ["New"]).offset(params[:offset]).order(id: :desc)
          end
      end
      if (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any?
        forms += if (period_first)
          Form.includes(:period, :role, :title).where(user_id: user_ids, period_id: period_first)
            .where.not(status: ["New"]).offset(params[:offset]).order(id: :desc)
        else
          Form.includes(:period, :role, :title).where(user_id: user_ids)
            .where.not(status: ["New"]).offset(params[:offset]).order(id: :desc)
        end
      end
      periods = Schedule.includes(:period).where(company_id: current_user.company_id).where.not(status: "Done").pluck(:period_id)
      forms = forms&.select {|item| filter[:status].include?(item[:status])} unless filter[:status].nil?
      results = forms.sort_by(&:status).uniq.map do |form|
        format_form_cds_review(form, user_approve_ids, periods, h_reviewers)
      end

      if filter[:period_id].count > 1
        title_histories = []
        if filter[:filter_users].present?
          if (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?
            title_histories += TitleHistory.includes(:period).where(period_id: period_none_first, user_id: user_approve_ids).order("periods.to_date DESC") 
          end
          if (@privilege_array & [REVIEW_CDS, HIGH_FULL_ACCESS]).any?
            title_histories += TitleHistory.includes(:period).where(period_id: period_none_first, user_id: user_review_ids).order("periods.to_date DESC")
          end
          if (@privilege_array & [FULL_ACCESS, FULL_ACCESS_MY_COMPANY]).any?
            title_histories += TitleHistory.includes(:period).where(period_id: period_none_first, user_id: user_ids).order("periods.to_date DESC")
          end
        else
          title_histories += TitleHistory.includes(:period).where(period_id: period_none_first).order("periods.to_date DESC")
        end 
        
        title_histories.each do |title_history|   
          period_prev = Schedule.includes(:period).where(company_id: title_history.user&.company_id).where("periods.to_date>=?", Period.find_by_id(title_history.period_id)&.to_date).order("periods.to_date ASC")
          title_history_prev = TitleHistory.includes(:period).where(user_id: title_history.user_id).where.not(period_id: period_prev&.pluck(:period_id)).order("periods.to_date").last
          
          # || (user_approve_ids.include? form.user_id)
          # (periods.include? form.period_id)
          results << {
            title_history_id: title_history.id,
            period_name: title_history.period&.format_name || "",
            user_name: title_history.user&.format_name_vietnamese,
            project: title_history.user&.get_project,
            email: title_history.user&.email,
            role_name: title_history.role_name,
            level: title_history_prev&.level || "N/A",
            rank: title_history_prev&.rank || "N/A",
            title: title_history_prev&.title || "N/A",
            submit_date: format_long_date(title_history.submited_date),
            approved_date: format_long_date(title_history.approved_date),
            status: "Done",
            user_id: title_history.user&.id,
            is_approver: false ,
            is_open_period: false,
            caculate_rank: title_history.rank || "N/A",
            caculate_level: title_history.level || "N/A",
            caculate_title: title_history.title || "N/A",
            count_cds: "0/0",
          }
        end
      end
      results
    end

    def get_list_cds_review_to_export
      filter = filter_cds_review_list
      if params[:period_id].nil?
        user_ids = Approver.where(approver_id: current_user.id).pluck(:user_id)
      else
        user_ids = Approver.where(approver_id: current_user.id, period_id: params[:period_id]).pluck(:user_id)
      end
      if @privilege_array.include? FULL_ACCESS
        user_ids = User.where(is_delete: false).pluck(:id)
      elsif @privilege_array.include? FULL_ACCESS_MY_COMPANY
        user_ids = User.where(company_id: current_user.company_id, is_delete: false).pluck(:id)
      end
      user_ids = User.where(filter[:filter_users]).where(id: user_ids).pluck(:id).uniq
      user_ids = ProjectMember.where(project_id: filter[:project_id], user_id: user_ids).pluck(:user_id).uniq if filter[:project_id].present?

      forms = Form.includes([:user, :period]).where(user_id: user_ids, period_id: params[:period_ids]).where.not(status: "New")
      results = {}
      companies_id = filter[:filter_users][:company_id]
      h_companies = if companies_id.nil?
          Company.pluck([:id, :name]).to_h
        else
          Company.where(id: companies_id).pluck([:id, :name]).to_h
        end

      forms.map do |form|
        company_id = form&.user&.company_id
        period_prev = Schedule.includes(:period).where(company_id: company_id).where("periods.to_date<?",Period.find_by_id(form.period.id)&.to_date).order("periods.to_date ASC").last
        if results[company_id].nil?
          results[company_id] = {
            users: [],
            company_name: h_companies[company_id],
            period: form.period_id,
            period_excel_name: form&.period&.format_excel_name,
            period_name: form&.period&.format_to_date,
            period_prev_name: period_prev&.period&.format_to_date || "",
            title_period: form&.period&.format_name,
            title_period_prev: period_prev&.period&.format_name
          }
        end

        results[company_id][:users] << format_form_cds_review_export(form, period_prev&.period&.id)
        results[company_id][:users].sort_by!{|item| item[:email]}
      end

      { data: results }
    end

    def data_filter_cds_view_others(company_id = nil)
      if company_id.nil?
        user_ids = User.where(is_delete: false)
      else
        user_ids = User.where(company_id: company_id, is_delete: false)
      end
      data_filter = {
        companies: [],
        projects: [],
        roles: [],
        users: [],
        periods: [],
      }

      users = User.where(id: user_ids).includes(:company, :role)
      users.each do |user|
        company = format_filter(user.company.name, user.company_id)
        user_arr = format_filter(user.format_name_vietnamese, user.id)
        role = format_filter(user.role.name, user.role_id) if user.role.present?
        data_filter[:companies] << company unless data_filter[:companies].include?(company)
        data_filter[:roles] << role unless data_filter[:roles].include?(role)
        data_filter[:users] << user_arr
      end
      data_filter[:roles].compact!

      project_members = ProjectMember.where(user_id: user_ids).includes(:project)
      project_members.each do |project_member|
        project = format_filter(project_member.project.name, project_member.project_id)
        data_filter[:projects] << project unless data_filter[:projects].include?(project)
      end

      forms = Form.where(user_id: user_ids, is_delete: false).where.not(status: "New").includes(:period).order("periods.from_date DESC")
      forms.each do |form|
        period = format_filter(form&.period&.format_name, form&.period_id)
        data_filter[:periods] << period unless data_filter[:periods].include?(period)
      end
      data_filter
    end

    def data_filter_cds_review
      user_ids = Approver.where(approver_id: current_user.id).pluck(:user_id)
      data_filter = {
        companies: [],
        projects: [],
        roles: [],
        users: [],
        periods: [],
      }

      users = User.where(id: user_ids).includes(:company, :role)
      users.each do |user|
        company = format_filter(user.company.name, user.company_id)
        user_arr = format_filter(user.format_name_vietnamese, user.id)
        role = format_filter(user.role.name, user.role_id) if user.role.present?
        data_filter[:companies] << company unless data_filter[:companies].include?(company)
        data_filter[:roles] << role unless data_filter[:roles].include?(role)
        data_filter[:users] << user_arr
      end
      data_filter[:roles].compact!

      project_members = ProjectMember.where(user_id: user_ids).includes(:project)
      project_members.each do |project_member|
        project = format_filter(project_member.project.name, project_member.project_id)
        data_filter[:projects] << project unless data_filter[:projects].include?(project)
      end

      forms = Form.where(user_id: user_ids, is_delete: false).where.not(status: "New").includes(:period).order("periods.from_date DESC")
      forms.each do |form|
        period = format_filter(form&.period&.format_name, form&.period_id)
        data_filter[:periods] << period unless data_filter[:periods].include?(period)
      end

      data_filter
    end

    def get_line_manager_miss_list
      form_id = params[:form_id]
      latest_period = Form.find_by(id: form_id)&.period_id
      staff_slots = FormSlot.distinct.joins(:form, :comments).where(form_id: form_id, comments: { is_commit: true }, is_change: true).where.not(comments: { point: nil}).pluck("slot_id")
      reviewer_slots = FormSlot.distinct.joins(:form, :line_managers).where(form_id: form_id, "line_managers.user_id": current_user.id, "line_managers.period_id": latest_period).where.not("line_managers.given_point": nil).pluck(:slot_id)
      staff_slot_ids = staff_slots.difference(reviewer_slots)
      slots = Slot.includes(:competency).where(id: staff_slot_ids).order("competencies.location", :slot_id, :level)
      results = {}
      competency_locations = {}
      slots.each do |slot|
        competency_name = slot.competency.name
        results[competency_name] ||= []
        competency_locations[slot.competency.id] ||= get_location_slot(slot.competency.id)
        results[competency_name] << competency_locations[slot.competency.id][slot.id]
      end

      results
    end

    def data_filter_cds_approve
      project_members = ProjectMember.where(user_id: current_user.id).includes(:project)
      user_ids = ProjectMember.where(project_id: project_members.pluck(:project_id)).pluck(:user_id).uniq
      data_filter = {
        companies: [],
        projects: [],
        roles: [],
        users: [],
        periods: [],
      }

      users = User.where(id: user_ids).includes(:company, :role)
      if @privilege_array.include?(HIGH_FULL_ACCESS)
        user_ids = Approver.where(approver_id: current_user.id).pluck(:user_id).uniq
        project_members = ProjectMember.where(user_id: users.pluck(:id)).includes(:project)
      end

      users = User.where(id: user_ids).includes(:company, :role)
      users.each do |user|
        company = format_filter(user.company.name, user.company_id)
        user_arr = format_filter(user.format_name_vietnamese, user.id)
        role = format_filter(user.role.name, user.role_id) if user.role.present?
        data_filter[:companies] << company unless data_filter[:companies].include?(company)
        data_filter[:roles] << role unless data_filter[:roles].include?(role)
        data_filter[:users] << user_arr
      end
      data_filter[:roles].compact!
      project_members.each do |project_member|
        project = format_filter(project_member.project.name, project_member.project_id)
        data_filter[:projects] << project unless data_filter[:projects].include?(project)
      end

      forms = Form.where(user_id: user_ids, is_delete: false).where.not(status: "New").includes(:period).order("periods.from_date DESC")
      forms.each do |form|
        period = format_filter(form&.period&.format_name, form&.period_id)
        data_filter[:periods] << period unless data_filter[:periods].include?(period)
      end

      data_filter
    end

    def get_list_cds_assessment(user_id = nil)
      user_id ||= current_user.id
      form = Form.where(user_id: user_id, is_delete: false).where.not(status: "Done").includes(:period, :role, :title).order(:id).last
      title_histories = TitleHistory.includes(:period).where(user_id: user_id).order("periods.to_date DESC")
      list_form = []
      title_histories.each do |title|
        list_form << {
          id: title.id,
          period_name: title.period&.format_name,
          role_name: title.role_name,
          level: title.level || "N/A",
          rank: title.rank || "N/A",
          submit_date: format_long_date(title.submited_date),
          approved_date: format_long_date(title.approved_date),
          title: title.title || "N/A",
          status: "Done",
        }
      end
      if form
        list_form.unshift({ id: form.id, period_name: form.period&.format_name || "New", role_name: form.role&.name, rank: form.rank || "N/A", title: form.title&.name || "N/A", status: form.status, level: form.level || "N/A", submit_date: format_long_date(form&.submit_date), approved_date: format_long_date(form&.approved_date) })
      end

      list_form
    end

    def format_data_slots(param = nil)
      param ||= params
      return format_data_old_slots if params[:title_history_id].present?

      filter_slots = filter_cds
      filter = {
        form_slots: { form_id: param[:form_id] },
        competency_id: param[:competency_id],
      }
      filter[:level] = param[:level] if param[:level].present?
      slots = Slot.distinct(:id).search_slots(params[:search]).joins(:form_slots).where(filter).order(:level, :slot_id).group(:id)
      hash = {}
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: param[:form_id], slot_id: slots.pluck(:id))
      form_slots = format_form_slot(form_slots)
      arr = []
      current_period = Form.find(param[:form_id])&.period_id
      slots.each do |slot|
        hash[slot.level] = 0 if hash[slot.level].nil?
        s = slot_to_hash(slot, hash[slot.level], form_slots)
        if filter_slots[:passed] && s[:tracking][:is_passed_prev]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:failed] && !s[:tracking][:is_passed]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:no_assessment] && s[:tracking][:point].zero? && !s[:tracking][:is_commit]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:cdp_assessment] && s[:tracking][:point].zero? && s[:tracking][:is_commit]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:cds_assessment] && !s[:tracking][:point].zero? && ( s[:tracking][:recommends].nil? || ( s[:tracking][:recommends].present? &&  s[:tracking][:recommends].select{ |line| line[:period_id].present? && line[:period_id] == current_period }.present? ))
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:need_to_update] && s[:tracking][:flag] == "orange"
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:cds_need_to_be_reviewed_cds] && !s[:tracking][:point].zero? && s[:tracking][:is_change]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:cds_need_to_be_reviewed_cdp] && s[:tracking][:point].zero? && s[:tracking][:is_change]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
        hash[slot.level] += 1
      end
      arr.each do |item|
        return item if item[:slot_id] == params[:search]
      end
      arr
    end

    def format_data_old_slots
      param ||= params
      title_history = TitleHistory.find_by_id(params[:title_history_id])
      period = title_history&.period_id
      filter_slots = filter_cds
      filter = {
        competency_id: param[:competency_id],
      }
      filter[:level] = param[:level] if param[:level].present?
      slots = Slot.distinct(:id).search_slots(params[:search]).joins(:form_slots).where(filter).order(:level, :slot_id).group(:id)
      slot_histories = FormSlotHistory.includes(:slot).where(title_history_id: params[:title_history_id], competency_id: params[:competency_id], slot_id: slots.pluck(:id))
      line_managers = LineManager.where(period_id: period, form_slot_id: slot_histories.pluck(:form_slot_id))
      
      approver_prevs_period = Approver.includes(:period).where("periods.to_date<=?", Period.find_by_id(period)&.to_date).where(user_id: title_history.user_id).order("periods.to_date DESC").pluck(:period_id)
      line_latest = LineManager.distinct(:form_slot_id).where(period_id: approver_prevs_period, form_slot_id: slot_histories.pluck(:form_slot_id))
      form_slots = get_recommend_by_form_slot(line_latest, title_history.user_id)

      slot_histories.map do |slot_history|
        h_slot = {
          id: slot_history.slot.id,
          slot_id: slot_history.slot_position,
          desc: slot_history.slot.desc,
          evidence: slot_history.slot.evidence,
          tracking: {
            comment_type: (slot_history.point.present? && slot_history.point > 0) ? "CDS" : "CDP",
            id: slot_history.form_slot_id,
            evidence: slot_history.evidence || "",
            point: slot_history.point || 0,
            is_commit: slot_history.point.present? || false,
            re_update: false,
          },
        }
        if form_slots.present?
          h_slot[:tracking][:recommends] = form_slots[slot_history.form_slot_id]
        end

        h_slot
      end
    end

    def unchange_slot
      form_slots = FormSlot.where(form_id: params[:form_id])
      form_slots.each { |form_slot| form_slot.update(is_change: false) }
    end

    def save_cds_staff
      form = Form.find_by_id(params[:form_id])
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.find_by(slot_id: params[:slot_id], form_id: params[:form_id])
        form_slot.update(re_assess: true) if LineManager.where(form_slot_id: form_slot.id).where.not(period_id: form.period_id).present?
        return false if form.nil?

        if params[:point].present?
          comment = Comment.where(form_slot_id: form_slot.id).where.not(point: nil).first
          old_comment = Comment.find_by(form_slot_id: form_slot.id, point: nil)
        else
          old_comment = Comment.where(form_slot_id: form_slot.id).where.not(point: nil).first
          comment = Comment.find_by(form_slot_id: form_slot.id, point: nil)
        end

        is_commit = params[:is_commit] == "true"
        line_flag = LineManager.find_by(form_slot_id: form_slot.id, flag: "orange", period_id: form.period_id)
        if comment.present?
          flag = comment.flag.blank? ? "" : "yellow"
          re_update = comment.flag.present? ? "" : params[:position]
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit, updated_at: Time.now, is_delete: false, flag: flag, re_update: re_update)
        else
          flag = line_flag&.flag.blank? ? "" : "yellow"
          re_update = line_flag&.flag.present?
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id, is_delete: false, flag: flag, re_update: re_update)
        end
        form_slot.update(is_change: true)
        old_comment.update(is_delete: true) if old_comment.present?
      end
      result = preview_result(form)
      calculate_level(result[form_slot.slot.competency.name])
    end

    def get_assessment_staff
      if params[:form_slot_id].present?
        if params[:type] == "CDS"
          Comment.where(form_slot_id: params[:form_slot_id].to_i).where.not(point: nil).first
        elsif params[:type] == "CDP"
          comment = Comment.where(form_slot_id: params[:form_slot_id].to_i, point: nil, is_commit: true).first
          if comment.nil?
            Comment.create!(is_commit: true, form_slot_id: params[:form_slot_id].to_i) 
          else
            return comment
          end
        else
          comment = Comment.where(form_slot_id: params[:form_slot_id].to_i)
          comment.update(is_delete: true)
          form = Form.find_by_id(params[:form_id])
          LineManager.where(form_slot_id: params[:form_slot_id].to_i, period_id: form.period_id).delete_all if form&.period
          formslots = FormSlot.where(id: params[:form_slot_id].to_i)
          formslots.update(is_change: false)
          { status: "Delete" }
        end
      end
    end

    def save_add_more_evidence
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.includes(:line_managers, :comments).find_by(slot_id: params[:slot_id], form_id: params[:form_id])
        return false if form_slot.nil?
        comment = form_slot.comments.where(is_delete: false).order(updated_at: :DESC).first
        line_manager = form_slot.line_managers.find_by_flag("orange")
        return false if line_manager.nil?
        approver = User.find(line_manager.user_id)
        is_commit = params[:is_commit] == "true"
        if comment.present?
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit, flag: "yellow")
          line_manager.update(flag: "yellow")
          period = Form.includes(:period).find(params[:form_id]).period
          Async.await do
            CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: params[:competency_name], user: current_user, from_date: period.from_date, to_date: period.to_date, reviewer: approver).user_add_more_evidence.deliver_later(wait: 3.seconds)
          end
        else
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id)
        end
      end
    end

    def request_add_more_evidence
      form = Form.includes(:period).find_by_id(params[:form_id])
      return false if form.nil?
      line = LineManager.where(form_slot_id: params[:form_slot_id], user_id: current_user.id, period_id: form.period_id).first
      form_slot = FormSlot.includes(:slot).find(params[:form_slot_id])
      competency_name = Competency.find(form_slot.slot.competency_id).name
      user = User.find(params[:user_id])
      if line.nil?
        LineManager.create!(form_slot_id: params[:form_slot_id], flag: "orange", period_id: form.period_id, user_id: current_user.id)
        comment = Comment.find_by(form_slot_id: params[:form_slot_id], is_delete: false)
        comment.nil? ? Comment.create!(form_slot_id: params[:form_slot_id], flag: "orange") : comment.update(flag: "orange")
        Async.await do
          CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: competency_name, staff: user, from_date: form.period.from_date, to_date: form.period.to_date).reviewer_requested_more_evidences.deliver_now
        end
        return "orange"
      end

      status = line.flag == "orange" ? "" : "orange"
      line.update(flag: status)
      comment = Comment.find_by(form_slot_id: params[:form_slot_id], is_delete: false)
      comment.nil? ? Comment.create!(form_slot_id: params[:form_slot_id], flag: status) : comment.update(flag: status)

      if status == "orange"
        Async.await do
          CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: competency_name, staff: user, from_date: form.period.from_date, to_date: form.period.to_date).reviewer_requested_more_evidences.deliver_now
        end
      else
        Async.await do
          CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: competency_name, staff: user, recommend: params[:recommend]).reviewer_cancelled_request_more_evidences.deliver_now
        end
      end
      status
    end

    def save_cds_manager
      if params[:recommend] && params[:given_point] && params[:slot_id] && params[:user_id]
        period_id = Form.find_by_id(params[:form_id])&.period_id
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        return false if form_slot.nil?
        line_manager = LineManager.where(user_id: current_user.id, form_slot_id: form_slot.id, period_id: period_id).first
        comment = Comment.where(form_slot_id: form_slot.id, is_delete: false).first
        staff_flag = comment.flag if comment.present?
        approver_ids = Approver.where(user_id: params[:user_id], is_approver: true, period_id: period_id).pluck(:approver_id)
        is_final = approver_ids.include? current_user.id
        return false if is_final && (comment&.is_commit&.to_s != params[:is_commit] || comment&.point.present? != params[:given_point].present?)
        comment_linemanager = LineManager.where(user_id: current_user.id, form_slot_id: form_slot.id, period_id: period_id).first
        flag = comment_linemanager&.flag || ""
        flag = "#99FF33" if !is_final && staff_flag == "yellow"
        if line_manager.present?
          line_manager.update(is_commit: params[:is_commit], recommend: params[:recommend], given_point: params[:given_point], period_id: period_id, flag: flag, final: is_final)
        else
          LineManager.create!(is_commit: params[:is_commit], recommend: params[:recommend], given_point: params[:given_point], user_id: current_user.id, form_slot_id: form_slot.id, period_id: period_id, flag: flag, final: is_final)
        end
      end
    end

    def preview_result(form = nil)
      competencies = Competency.where(template_id: form&.template_id).order(:location).pluck(:id)
      return false if competencies.empty?
      filter = {
        competency_id: competencies,
      }
      slots = Slot.includes(:competency).left_outer_joins(:form_slots).where(filter).order("competencies.id", :level, :slot_id)
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: form.id, slot_id: slots.pluck(:id)).order("line_managers.id desc", "comments.updated_at desc")
      form_slots = get_point_for_result(form_slots)

      h_point = {}
      h_poisition_level = {}
      slots.map do |slot|
        key = slot.competency.name + slot.level.to_s
        h_poisition_level[key] = 0 if h_poisition_level[key].nil?
        h_point[slot.competency.name] = {} if h_point[slot.competency.name].nil?
        data = form_slots[slot.id] || {
          id: 0,
          point: 0,
          point_cdp: 0,
          is_commit: false,
          is_change: false,
          final_point_cdp: nil,
          final_point: nil,
          is_passed: false,
          recommends: {},
        }
        value = data[:final_point] || data[:point]
        value_cdp = data[:final_point_cdp] || data[:point_cdp]
        
        if form.status != "Done"
          if data[:is_change]
            value = data[:point]
            value_cdp = data[:point_cdp]
          end

          if current_user.id != form.user_id
            # if privilege_array.include?(REVIEW_CDS)
              value_cdp = data[:recommends].find{|item| item[current_user.id]}[current_user.id][:given_point_cdp] if data[:recommends].find{|item| item[current_user.id]}
              value = data[:recommends].find{|item| item[current_user.id]}[current_user.id][:given_point] if data[:recommends].find{|item| item[current_user.id]}
            # elsif (@privilege_array & [APPROVE_CDS, HIGH_FULL_ACCESS]).any?
            #   value = data[:final_point] || value
            #   value_cdp = data[:final_point_cdp] || value_cdp
            # end
          end
        end

        type = "new"
        class_name = ""
        type = "assessed" if data[:is_change]
        type = "re-assessed-slots" if data[:re_assess]
        class_name = "slot-cdp" if !value_cdp&.zero? && value&.zero?
        class_name = "fail-slot" if !value.zero? && value < 3
        class_name = "pass-slot" if !value.zero? && value > 2
        
        h_slot = {
          value: value,
          value_cdp: value_cdp,
          type: type,
          class: class_name,
        }

        unless data[:is_commit]
          h_slot = {
            value: 0,
            value_cdp: 0,
            type: "new",
            class: "",
          }
        end
        h_point[slot.competency.name][slot.level + LETTER_CAP[h_poisition_level[key]]] = h_slot
        h_poisition_level[key] += 1
      end
      h_point
    end

    def data_view_result(form_id = nil)
      form_id ||= params[:form_id]
      form = Form.includes(:title).find_by_id(form_id)
      return false if form.nil?
      competencies = Competency.where(template_id: form.template_id).select(:name, :id, :_type)
      result = preview_result(form)

      calculate_result(form, competencies, result)
    end

    def calculate_result(form, competencies, result)
      return false if form.nil? || competencies.empty? || !result
      h_result = calculate_result_by_type(form, competencies, result)
      h_result[:cdp] = calculate_result_by_type(form, competencies, result, :value_cdp)
      h_result
    end

    def calculate_result_by_type(form, competencies, result, type = :value)
      return false if form.nil? || competencies.empty? || !result
      competencies.map do |compentency|
        compentency.level = calculate_level(result[compentency.name], type)
      end

      hash = {}
      title_mappings = TitleMapping.select(:competency_id, :value, "titles.rank").includes(:competency).joins(:title)
        .where(titles: { role_id: form.role_id }).order(:competency_id, :value)
      title_mappings.map do |title_mapping|
        if hash[title_mapping.competency_id].nil?
          hash[title_mapping.competency_id] = {
            value: [],
            type: title_mapping.competency.type,
          }
        end

        hash[title_mapping.competency_id][:value] << title_mapping.value
      end

      h_title = {}
      Title.select(:rank, :name).where(role_id: form.role_id).map do |title|
        h_title[title.rank] = title.name
      end

      hash_rank = {}
      h_competency_type = { "All" => [] }
      competencies.each do |competency|
        val_cdp = convert_value_title_mapping(competency.level)
        h_rank_value = hash[competency.id][:value].count { |x| val_cdp >= x || x == 99999 }
        competency.rank = h_rank_value
        competency.title_name = h_title[h_rank_value]

        hash_rank[competency.id] = {
          value: h_rank_value,
          name: h_title[h_rank_value],
        }

        if h_competency_type[hash[competency.id][:type]].nil?
          h_competency_type[hash[competency.id][:type]] = []
        end

        h_competency_type[hash[competency.id][:type]] << competency.rank
        h_competency_type["All"] << competency.rank
      end

      level_mappings = LevelMapping.joins(:title).where(titles: { role_id: form.role_id }).order("titles.rank", :level)

      h_level_mapping = {}
      level_mappings.each do |level_mapping|
        key = "#{level_mapping.title_id}_#{level_mapping.level}"
        h_level_mapping[key] = [] if h_level_mapping[key].nil?
        h_level_mapping[key] << level_mapping
      end

      title_history = TitleHistory.includes(:period).where(user_id: form.user_id).where.not(period_id: form.period_id).order("periods.to_date").last
      current_title = {
        level: title_history&.level || "N/A",
        rank: title_history&.rank || "N/A",
        title: title_history&.title || "N/A",
      }

      expected_title = {
        level: "N/A",
        rank: "N/A",
        title: "N/A",
        title_id: nil,
      }
      h_level_mapping.each do |key, value|
        is_pass = 0
        value.each do |val|
          if h_competency_type[val.competency_type]
            count = h_competency_type[val.competency_type].count { |i| i >= val.rank_number }
            is_pass += 1 if count >= val.quantity
          end
        end

        break unless is_pass == value.count
        expected_title[:level] = value.first.level
        expected_title[:rank] = value.first.title.rank
        expected_title[:title] = value.first.title.name
        expected_title[:title_id] = value.first.title.id
      end

      h_competencies = competencies.map do |com|
        {
          id: com.id,
          name: com.name,
          rank: com.rank,
          level: com.level,
          title_name: com.title_name || "N/A",
        }
      end

      return expected_title if type == :value_cdp
      {
        competencies: h_competencies,
        current_title: current_title,
        expected_title: expected_title,
      }
    end

    def calculate_level(hash_point, type = :value)
      return "0" if hash_point.nil?
      s_level = ""
      hash = {}
      hash_point.each do |key, value|
        if hash[key.to_i].nil?
          hash[key.to_i] = {
            count: 0,
            sum: 0,
            fail: 0,
          }
        end
        hash[key.to_i][:count] += 1
        hash[key.to_i][:sum] += value[type] unless value[type].nil?
        hash[key.to_i][:fail] += 1 if value[type].present? && value[type] < 3
      end

      hash.each do |k, v|
        plp = v[:count] * 5 / 2.0
        break if v[:sum].zero?
        if plp <= v[:sum].to_f
          if v[:fail].zero?
            s_level = "#{k}"
          else
            s_level = "++#{k}"
            break
          end
        elsif v[:fail] < v[:count]
          s_level = "#{k - 1}-#{k}"
          break
        end
      end

      return "0" if s_level.empty?
      s_level
    end

    def approve_cds
      form = Form.where(id: params[:form_id], status: "Awaiting Approval").where.not(period: nil).first
      return "fail" if form.nil?
      competencies = Competency.where(template_id: form.template_id).select(:name, :id)

      result = preview_result(form)
      calculate_result = calculate_result_by_type(form, competencies, result)
      if calculate_result[:expected_title][:rank] == form.rank && calculate_result[:expected_title][:level] == form.level
        keep = (form.number_keep || 0) + 1
      else
        period_keep = form.period_id
      end
      period_keep ||= form.period_keep_id

      return "fail" unless form.update(status: "Done", title_id: calculate_result[:expected_title][:title_id], rank: calculate_result[:expected_title][:rank], level: calculate_result[:expected_title][:level], number_keep: keep, period_keep_id: period_keep)

      title_history = TitleHistory.new({ rank: calculate_result[:expected_title][:rank], title: calculate_result[:expected_title][:title], level: calculate_result[:expected_title][:level], role_name: form.role.name, user_id: form.user_id, period_id: form.period_id })
      return "fail" unless title_history.save

      form_slots = FormSlot.joins(:line_managers).includes(:line_managers).where(form_id: params[:form_id]).where.not(line_managers: { id: nil })
      slots = Slot.includes(:competency).where(id: form_slots.pluck(:slot_id)).order(:competency_id, :level, :slot_id)
      form_slots = format_form_slot(form_slots)
      hash = {}
      slots.map do |slot|
        key = slot.competency.name + slot.level.to_s
        hash[key] = 0 if hash[key].nil?
        data = {
          point: form_slots[slot.id][:point],
          evidence: form_slots[slot.id][:evidence],
          form_slot_id: form_slots[slot.id][:id],
          competency_id: slot.competency_id,
          title_history_id: title_history.id,
          slot_id: slot.id,
          slot_position: slot.level.to_s + LETTER_CAP[hash[key]],
        }
        form_slot_history = FormSlotHistory.new(data)
        return "fail" unless form_slot_history.save

        hash[key] += 1
      end
      user = User.find(form.user_id)
      period = Period.find(form.period_id)
      if form.is_approved
        user.update(title_id: calculate_result[:expected_title][:title_id])
        Async.await do
          CdsAssessmentMailer.with(staff: user, rank_number: form.rank, level_number: form.level, title_number: form.title&.name, from_date: period.from_date, to_date: period.to_date).pm_re_approve_cds.deliver_later(wait: 3.seconds)
        end
      else
        Async.await do
          CdsAssessmentMailer.with(staff: user, rank_number: form.rank, level_number: form.level, title_number: form.title&.name, from_date: period.from_date, to_date: period.to_date).pm_approve_cds.deliver_later(wait: 3.seconds)
        end
      end
      return "fail" unless form.update(is_approved: true, status: "Done", approved_date: DateTime.now())
      FormSlot.where(form_id: form.id, is_change: true).update(is_change: false)
      FormSlot.where(form_id: form.id, re_assess: true).update(re_assess: false)

      line_not_final = LineManager.includes(:form_slot).where(form_slots: { form_id: form.id }, user_id: current_user.id, final: false, period_id: form.period_id)
      line_not_final.update(final: true)

      form_slots_cdp = FormSlot.includes(:comments).where(form_id: form.id,"comments.is_commit": true,"comments.point": nil)
      form_slots_cdp.each do |form_slot_cdp|
        LineManager.create!(recommend: "", user_id: current_user.id, final: true, flag: "",period_id: form.period_id, form_slot_id: form_slot_cdp.id, is_commit: true) if form_slot_cdp.line_managers.where(final: true).blank?
      end

      have_flag_comment = Comment.includes(:form_slot).where(form_slots: { form_id: form.id }).where.not(flag: "")
      have_flag_comment.update(flag: "")
      
      have_flag_lineManager = LineManager.includes(:form_slot).where(form_slots: { form_id: form.id }).where.not(flag: "")
      have_flag_lineManager.update(flag: "")
      
      "success"
    end

    def withdraw_cds
      form = Form.where(id: params[:form_id], status: "Awaiting Review").where.not(period: nil).first
      if form.nil?
        form = Form.where(id: params[:form_id], status: "Awaiting Approval").where.not(period: nil).first
        return "fail" if form.nil?
        count_approver = Approver.where(user_id: current_user.id, period_id: form.period_id).count
        return "fail" if !count_approver.zero? && count_approver > 1
      end

      return "fail" unless reset_all_approver_submit_status(current_user.id)
      # can't withdraw other people's form
      return "fail" if (current_user.id != form.user_id)
      return "fail" unless form.update(status: "New")
      period = form.period
      comments = Comment.includes(:form_slot).where(form_slots: { form_id: params[:form_id] }).where.not(flag: "")
      return "fail" unless comments.update(flag: "")
      line_managers = LineManager.includes(:form_slot).where(form_slots: { form_id: params[:form_id] }).where.not(flag: "")
      return "fail" unless line_managers.update(flag: "")
      # send mail
      reviewer_ids = Approver.where(user_id: current_user.id, period_id: form.period_id).pluck(:approver_id)
      reviewer = User.where(id: reviewer_ids).pluck(:account, :email)
      Async.await do
        CdsAssessmentMailer.with(account: current_user.account, from_date: period.from_date,
                                 to_date: period.to_date, reviewers: reviewer, user_name: current_user.format_name).staff_withdraw_CDS_CDP.deliver_later(wait: 5.seconds)
      end
      "success"
    end

    def reject_cds
      form = Form.where(id: params[:form_id], status: "Done").where.not(period: nil).first
      return "fail" if form.nil?

      title_history = TitleHistory.includes(:period).where(user_id: params[:user_id]).order("periods.to_date desc").first
      return "fail" unless title_history.destroy
      return "fail" unless form.update(status: "Awaiting Approval")
      "success"
    end

    def get_data_view_history
      line_managers = LineManager.includes(:period).where(form_slot_id: params[:form_slot_id]).order("periods.to_date")
      recommends = get_recommend_by_period(line_managers)
      slot_histories = FormSlotHistory.joins(:title_history).where(form_slot_id: params[:form_slot_id])
      hash = {}
      slot_histories.map do |h|
        hash[h.title_history.period.format_name] = {
          evidence: h.evidence || "",
          point: h.point || 0,
          recommends: recommends,
        }
      end
      hash
    end

    def get_data_form_slot
      line = LineManager.find_by(form_slot_id: params[:form_slot_id], flag: "orange")
      return false if line.nil?
      slot = Slot.includes(:competency).joins(:form_slots).find_by(form_slots: { id: params[:form_slot_id] })
      reviewer = User.find_by_id(line.user_id)
      comment = Comment.find_by(form_slot_id: params[:form_slot_id], is_delete: false)

      {
        competency_name: slot.competency.name,
        slot_id: slot.id,
        slot_desc: slot.desc,
        slot_evidence: slot.evidence,
        reviewer_name: reviewer.account,
        line_given_point: line.given_point,
        line_recommends: line.recommend,
        comment_is_commit: comment.is_commit ? 1 : 0,
        comment_point: comment.point,
        comment_evidence: comment.evidence,
      }
    end

    def get_conflict_assessment
      form_slots = FormSlot.includes(slot: [:competency]).includes(:comments, :line_managers).where(form_id: params[:form_id], line_managers: { user_id: current_user.id }).where.not(comments: { point: nil})
      return if form_slots.nil?
      location_slots = get_location_slot(form_slots.pluck("competencies.id").uniq)
      slot_conflicts = {}
      form_slots.each do |form_slot|
        comment = form_slot.comments.where(is_delete: false).order(updated_at: :DESC).first
        line_manager = form_slot.line_managers.first
        competency_name = form_slot.slot.competency.name
        if (comment.nil? && line_manager.is_commit) || (comment.present? && comment.point.nil? && !line_manager.given_point.nil?)
          slot_conflicts[competency_name] = [] if slot_conflicts[competency_name].nil?
          slot_conflicts[competency_name] << location_slots[form_slot.slot_id]
        end
      end
      slot_conflicts
    end

    def request_update_cds(form_slot_ids, slot_id)
      period = Form.includes(:period).find_by_id(params[:form_id])&.period
      approver_id = Approver.find_by(user_id: params[:user_id], is_approver: true, period_id: period.id)&.approver_id
      return false if period.nil? || approver_id.nil?
      line_managers = if approver_id == current_user.id
          LineManager.where(form_slot_id: form_slot_ids, period_id: period.id)
        else
          LineManager.where(form_slot_id: form_slot_ids, user_id: current_user.id, period_id: period&.id)
        end
      line_managers.each do |line_manager|
        return false unless line_manager.update(flag: "orange")
      end
      form_slot_ids.each do |form_slot_id|
        comment = Comment.find_by(form_slot_id: form_slot_id, is_delete: false)
        comment.nil? ? Comment.create(form_slot_id: form_slot_id, flag: "orange") : comment.update(flag: "orange")
      end
      user_staff = User.find_by_id(params[:user_id])
      Async.await do
        CdsAssessmentMailer.with(staff: user_staff, from_date: period.from_date, to_date: period.to_date, slots: JSON.parse(slot_id)).reviewer_request_update.deliver_later(wait: 3.seconds)
      end
      "success"
    end

    def cancel_request(form_slot_ids, slot_id)
      form = Form.joins(:form_slots).where(form_slots: { id: form_slot_ids.first })&.first
      approver_id = Approver.find_by(user_id: params[:user_id], is_approver: true, period_id: form.period_id)&.approver_id
      return false if form.nil? || approver_id.nil?
      line_managers = if approver_id == current_user.id
          LineManager.where(form_slot_id: form_slot_ids, period_id: form.period_id).where.not(flag: "")
        else
          LineManager.where(form_slot_id: form_slot_ids, user_id: current_user.id).where.not(flag: "")
        end
      return "fails" unless line_managers.update(flag: "")
      form_slot_ids.each do |form_slot_id|
        comment = Comment.find_by(form_slot_id: form_slot_id, is_delete: false)
        comment.update(flag: "") if comment.present?
      end
      user_staff = User.find_by_id(params[:user_id])
      Async.await do
        CdsAssessmentMailer.with(staff: user_staff, slots: JSON.parse(slot_id)).reviewer_cancel_request_update.deliver_later(wait: 3.seconds)
      end
      "success"
    end

    def load_form_cds_staff
      form = Form.includes(:form_slots).find_by(user_id: params[:user_id])
      return "fails" if form.nil? || form.form_slots.empty?

      "/forms/cds_cdp_review?form_id=#{form.id}&user_id=#{params[:user_id]}"
    end

    def get_suggest_level
      return if params[:title_id].nil?
      title_id = params[:title_id]
      data_caculate = data_view_result
      current_title = data_caculate[:expected_title]
  
      if current_title[:title_id].to_s == title_id
        level = LevelMapping.where(title_id: title_id).where("level > ?", current_title[:level]).pluck(:level).uniq
      else
        level = LevelMapping.where(title_id: title_id).pluck(:level).uniq
      end
      level
    end

    private

    attr_reader :params, :current_user, :privilege_array

    def format_filter(name, id)
      {
        id: id,
        name: name,
      }
    end

    def slot_to_hash(slot, location, form_slots)
      h_slot = {
        id: slot.id,
        slot_id: slot.level + LETTER_CAP[location],
        desc: slot.desc,
        evidence: slot.evidence,
      }
      if form_slots.present?
        h_slot[:tracking] = form_slots[slot.id]
        h_slot[:tracking][:is_passed_prev] = true if h_slot[:tracking] && h_slot[:tracking][:recommends] && h_slot[:tracking][:recommends].select{ |line| line[:is_pm] == true && line[:given_point].present? && line[:given_point] >= 3 }.present?
      end

      h_slot
    end

    def format_form_slot(form_slots, count = nil)
      hash = {}
      if count
        form_slots.map do |form_slot|
          if hash[form_slot.slot_id].nil?
            hash[form_slot.slot_id] = form_slot.comments.present?
          end
        end
        return hash
      end
      form_slots.map do |form_slot|
        comments = form_slot.comments.where(is_delete: false).order(updated_at: :DESC).first
        if comments&.is_commit
          comment_type = comments.point.nil? ? "CDP" : "CDS"
        end
        recommends = get_recommend(form_slot,form_slot.is_change || false,comment_type || "")
        next unless hash[form_slot.slot_id].nil?

        hash[form_slot.slot_id] = {
          id: form_slot.id,
          evidence: comments&.evidence || "",
          point: comments&.point || 0,
          flag: comments&.flag || "",
          is_commit: comments&.is_commit,
          re_update: comments&.re_update,
          is_change: form_slot.is_change || false,
          final_point: recommends[:final_point],
          is_passed: recommends[:is_passed],
          recommends: recommends[:recommends],
          comment_type: comment_type || recommends[:comment_type],
        }
      end
      hash
    end

    def get_recommend(form_slot,is_change,comment_type_slot)
      line_managers = form_slot.line_managers.order("periods.to_date desc")
      hash = {
        is_passed: false,
        recommends: [],
      }
      period_id = 0
      form = Form.find(form_slot.form_id)
      user = User.find(form.user_id)
      is_line_new = LineManager.where(form_slot_id: form_slot.id, period_id: form.period_id).order(updated_at: :desc).blank?
      is_line_new = LineManager.where(form_slot_id: form_slot.id).order(updated_at: :desc).blank? if form.period_id.nil?
        
      approver_prevs_period = Approver.includes(:period).where(user_id: form.user_id).order("periods.to_date DESC").pluck(:period_id)
      line_latest = LineManager.where(form_slot_id: form_slot.id, period_id: approver_prevs_period).order(updated_at: :desc).pluck(:period_id).first
      approvers = Approver.where(user_id: form.user_id, period_id: line_latest).order(is_approver: :asc)
      approvers = Approver.where(user_id: user.id, period_id: form.period_id).order(is_approver: :asc) if is_change
      approvers.each_with_index do |approver, i|
        if is_change || form.status == "Done" || !is_line_new
          line = LineManager.where(user_id: approver.approver_id, form_slot_id: form_slot.id, period_id: line_latest).order(updated_at: :desc).first
          line = LineManager.where(user_id: approver.approver_id, form_slot_id: form_slot.id, period_id: form.period_id).order(updated_at: :desc).first if is_change
          line = LineManager.where(user_id: approver.approver_id, form_slot_id: form_slot.id, period_id: line_latest).order(updated_at: :desc).first if form.status == "Done" && line.nil?
        else
          line = LineManager.where(user_id: approver.approver_id, form_slot_id: form_slot.id).order(updated_at: :desc).first
        end
        if line.blank? || (is_change && line.user_id != approver.approver_id) || ((line.given_point || 0) <= 2 && line.user_id != approver.approver_id)
          hash[:recommends] << {
            given_point: "",
            recommends: "",
            name: User.find(approver.approver_id).account,
            flag: "",
            user_id: User.find(approver.approver_id).id,
            is_final: "",
            is_commit: false,
            is_pm: approver.is_approver,
            period_id: form.period&.id
          }
        elsif is_change
          break if !period_id.zero? && period_id != line.period_id
          period_id = line.period_id
          if line.final && (line.given_point || 0) > 2
            hash[:is_passed] = true
            hash[:final_point] = line.given_point
          end
          hash[:recommends] << {
            given_point: line.given_point || 0,
            recommends: line.recommend || "",
            name: User.find(line.user_id).account,
            flag: line.flag || "",
            user_id: line.user_id,
            is_final: line.final,
            comment_type: comment_type_slot,
            is_commit: line&.is_commit,
            is_pm: approver.is_approver,
            period_id: line.period_id
          }
        else
          break if !period_id.zero? && period_id != line.period_id
          period_id = line.period_id
          if line.final && (line.given_point || 0) > 2
            hash[:is_passed] = true
            hash[:final_point] = line.given_point
          end
          comment_type = ""

          if line&.is_commit
            comment_type = line.given_point.nil? ? "CDP" : "CDS"
          end
          hash[:recommends] << {
            given_point: line.given_point || 0,
            recommends: line.recommend || "",
            name: User.find(line.user_id).account,
            flag: line.flag || "",
            user_id: line.user_id,
            is_final: line.final,
            comment_type: comment_type,
            is_commit: line&.is_commit,
            is_pm: approver.is_approver,
            period_id: line.period_id
          }
        end
      end
      hash
    end

    def get_recommend_by_period(line_managers)
      line_managers.map do |line|
        {
          given_point: line.given_point,
          recommends: line.recommend,
          reviewed_date: line.format_updated_date,
          name: User.find(line.user_id).account,
        }
      end
    end

    def get_recommend_by_form_slot(line_managers, user_id)
      hash = {}
      line_managers.map do |line|
        hash[line.form_slot_id] = [] if hash[line.form_slot_id].nil?
        hash[line.form_slot_id] << {
          given_point: line.given_point || 0,
          recommends: line.recommend,
          reviewed_date: line.updated_at&.strftime("%d-%m-%Y %H:%M:%S"),
          name: User.find(line.user_id).account,
          is_commit: line.is_commit || false,
          is_pm: Approver.where(approver_id: line.user_id, user_id: user_id, period_id: line.period_id).first&.is_approver,
        }
      end
      hash
    end

    def format_form_cds_review(form, user_approve_ids = [], periods = [], h_reviewers = {})
      comments = Comment.includes(:form_slot).where(form_slots: { form_id: form.id, is_change: true}, is_commit: true).where.not(point: nil)
      form_slot_ids = comments.map{|comment| comment.form_slot&.id}
      line = LineManager.includes(:form_slot).where(form_slots: { id: form_slot_ids, is_change: true}, user_id: current_user.id, period_id: form.period_id)
      if form.status == "Done"
        period_prev = Schedule.includes(:period).where(company_id: form.user&.company_id).where("periods.to_date>=?", Period.find_by_id(form.period_id)&.to_date).order("periods.to_date ASC")
        title_history = TitleHistory.includes(:period).where(user_id: form.user_id).where.not(period_id: period_prev&.pluck(:period_id)).order("periods.to_date").last
        return {
          id: form.id,
          period_name: form.period&.format_name || "New",
          user_name: form.user&.format_name_vietnamese,
          project: form.user&.get_project,
          email: form.user&.email,
          role_name: form.role&.name,
          level: title_history&.level || "N/A",
          rank: title_history&.rank || "N/A",
          title: title_history&.title || "N/A",
          submit_date: format_long_date(form.submit_date),
          approved_date: format_long_date(form.approved_date),
          status: form.status,
          user_id: form.user&.id,
          is_approver: (user_approve_ids.include? form.user_id),
          is_open_period: (periods.include? form.period_id),
          caculate_rank: form.rank || "N/A",
          caculate_level: form.level || "N/A",
          caculate_title: form.title&.name || "N/A",
          count_cds: "#{line.count}/#{comments.count}",
        } 
      end
      {
        id: form.id,
        period_name: form.period&.format_name || "New",
        user_name: form.user&.format_name_vietnamese,
        project: form.user&.get_project,
        email: form.user&.email,
        role_name: form.role&.name,
        level: form.level || "N/A",
        rank: form.rank || "N/A",
        title: form.title&.name || "N/A",
        submit_date: format_long_date(form.submit_date),
        approved_date: format_long_date(form.approved_date),
        status: h_reviewers[form.user_id] ? "Submitted" : form.status,
        user_id: form.user&.id,
        is_approver: (user_approve_ids.include? form.user_id),
        is_open_period: (periods.include? form.period_id),
        caculate_rank: "N/A",
        caculate_level: "N/A",
        caculate_title: "N/A",
        count_cds: "#{line.count}/#{comments.count}",
      }
    end

    def format_form_cds_review_export(form, period_prev_id, user_approve_ids = [], periods = [], h_reviewers = {})
      title_history = TitleHistory.includes(:period).where(user_id: form.user&.id,"periods.id": period_prev_id).last
      {
        id: form.id,
        period_name: form.period&.format_name || "New",
        user_name: form.user&.format_name_vietnamese,
        project: form.user&.get_project,
        email: form.user&.email,
        role_name: form.role&.name,
        level: form.level || "N/A",
        rank: form.rank || "N/A",
        title: form.title&.name || "N/A",
        submit_date: format_long_date(form.submit_date),
        approved_date: format_long_date(form.approved_date),
        status: h_reviewers[form.user_id] ? "Submitted" : form.status,
        user_id: form.user&.id,
        is_approver: (user_approve_ids.include? form.user_id),
        is_open_period: (periods.include? form.period_id),
        prev_role_name: title_history&.role_name || "N/A",
        prev_level: title_history&.level || "N/A",
        prev_rank: title_history&.rank || "N/A",
        prev_title: title_history&.title || "N/A",
      }
    end

    def filter_cds
      hash = {}
      params[:filter].split(",").map do |filter|
        hash[filter.to_sym] = true
      end
      hash
    end

    def filter_cds_review_list
      filter_users = {}
      filter = {}

      if params[:user_ids] && params[:user_ids].first != "0"
        filter_users[:id] = params[:user_ids]
      end
      if params[:role_ids] && params[:role_ids].first != "0"
        filter_users[:role_id] = params[:role_ids]
      end

      if params[:company_ids] && params[:company_ids].first != "0"
        filter_users[:company_id] = params[:company_ids]
      end

      if params[:period_ids] && params[:period_ids].first != "0"
        filter[:period_id] = params[:period_ids]
      end

      if params[:project_ids] && params[:project_ids].first != "0"
        filter[:project_id] = params[:project_ids]
      end

      if params[:status] && params[:status].first != "0"
        filter[:status] = params[:status]
      end

      filter[:filter_users] = filter_users

      filter
    end

    def get_point_for_result(form_slots)
      hash = {}
      form_slots.map do |form_slot|
        next unless hash[form_slot.slot_id].nil?
        recommends = get_point_manager(form_slot)
        comments = form_slot.comments.where(is_delete: false).order(updated_at: :DESC).first
        point_cdp = comments&.is_commit && comments&.point.nil? ? 3 : comments&.point

        hash[form_slot.slot_id] = {
          id: form_slot.id,
          point: comments&.point || 0,
          point_cdp: point_cdp || 0,
          is_commit: comments&.is_commit,
          is_change: form_slot.is_change,
          re_assess: form_slot.re_assess,
          final_point_cdp: recommends[:final_point_cdp],
          final_point: recommends[:final_point],
          is_passed: recommends[:is_passed],
          recommends: recommends[:recommends],
        }
      end
      hash
    end

    def get_point_manager(form_slot)
      line_managers = form_slot.line_managers
      hash = {
        is_passed: false,
        is_failed_prev: true,
        is_passed_prev: false,
        recommends: [],
        final_point: 0,
        final_point_cdp: 0,
      }
      period_id = 0

      line_managers.each do |line|
        if !period_id.zero? && period_id != line.period_id
          check_fail = (line.given_point || 0) < 2
          hash[:is_failed_prev] = check_fail
          hash[:is_passed_prev] = !check_fail
          break
        end
        period_id = line.period_id
        if line.final
          if (line.given_point || 0) > 2
            hash[:is_passed] = true
          end
          hash[:final_point] = line.given_point
          hash[:final_point_cdp] = line.given_point.nil? && line.is_commit ? 3 : line.given_point
        end
        hash[:recommends] << {
          line.user_id => {
                            given_point: line.given_point || 0,
                            given_point_cdp: line.given_point.nil? && line.is_commit ? 3 : line.given_point,
                            is_final: line.final,
                          },
        }
      end
      hash
    end
  end
end
