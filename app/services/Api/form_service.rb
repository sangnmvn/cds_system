module Api
  class FormService < BaseService
    REVIEW_CDS = 16
    APPROVE_CDS = 17

    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_competencies(form_id = nil)
      return get_old_competencies if params[:title_history_id].present?

      if form_id.nil?
        form_id = Form.select(:id).find_by(user_id: current_user.id, is_delete: false).id
      end
      slots = Slot.select(:id, :desc, :evidence, :level, :competency_id, :slot_id).includes(:competency).joins(:form_slots).where(form_slots: { form_id: form_id }).order(:competency_id, :level, :slot_id)
      hash = {}
      form_slots = FormSlot.includes(:comments).where(form_id: form_id)
      form_slots = format_form_slot(form_slots, true)
      slots.map do |slot|
        key = slot.competency.name
        if hash[key].nil?
          hash[key] = {
            type: slot.competency.sort_type,
            id: slot.competency_id,
            levels: {},
          }
        end
        if hash[key][:levels][slot.level].nil?
          hash[key][:levels][slot.level] = {
            total: 0,
            current: 0,
          }
        end
        hash[key][:levels][slot.level][:total] += 1
        hash[key][:levels][slot.level][:current] += 1 if form_slots[slot.id]
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

    def create_form_slot(role_id = nil)
      role_id ||= current_user.role_id
      template_id = Template.find_by(role_id: role_id, status: true)&.id
      return 0 if template_id.nil?

      competency_ids = Competency.where(template_id: template_id).order(:location).pluck(:id)
      slot_ids = Slot.where(competency_id: competency_ids).order(:level, :slot_id).pluck(:id)

      form = Form.new(user_id: current_user.id, _type: "CDS", template_id: template_id, level: 2, rank: 2, title_id: 1, role_id: 1, status: "New", is_delete: false)
      if form.save
        slot_ids.map do |id|
          FormSlot.create!(form_id: form.id, slot_id: id, is_passed: 0)
        end
      end

      form
    end

    def get_list_cds_review
      filter = filter_cds_review_list
      user_ids = User.where(filter[:filter_users]).pluck(:id)
      user_ids = ProjectMember.where(project_id: filter[:project_id], user_id: user_ids).pluck(:user_id).uniq if filter[:project_id].present?
      user_ids = Approver.where(approver_id: current_user.id, user_id: user_ids).pluck(:user_id).uniq

      forms = Form.where(_type: "CDS", user_id: user_ids, period_id: filter[:period_id]).where.not(status: "New").includes(:period, :role, :title).limit(LIMIT).offset(params[:offset]).order(id: :desc)

      forms.map do |form|
        format_form_cds_review(form)
      end
    end

    def get_list_cds_approve
      filter = filter_cds_review_list
      user_ids = User.where(filter[:filter_users]).pluck(:id).uniq
      user_ids = ProjectMember.where(project_id: filter[:project_id], user_id: user_ids).pluck(:user_id).uniq if filter[:project_id].present?

      forms = Form.where(_type: "CDS", user_id: user_ids, period_id: filter[:period_id]).where.not(status: "New").includes(:period, :role, :title).limit(LIMIT).offset(params[:offset]).order(id: :desc)

      forms.map do |form|
        format_form_cds_review(form)
      end

      data_filter
    end

    def data_filter_cds_approve
      project_members = ProjectMember.where(user_id: current_user.id).includes(:project)
      user_ids = ProjectMember.where(project_id: project_members.pluck(:project_id)).pluck(:user_id).uniq

      data_filter = {
        companies: [["All", 0]],
        projects: [["All", 0]],
        roles: [["All", 0]],
        users: [["All", 0]],
        periods: [["All", 0]],
      }

      users = User.where(id: user_ids).includes(:company, :role)
      users.each do |user|
        company = [user.company.name, user.company_id]
        user_arr = [user.format_name, user.id]
        role = [user.role.name, user.role_id]
        data_filter[:companies] << company unless data_filter[:companies].include?(company)
        data_filter[:roles] << role unless data_filter[:roles].include?(role)
        data_filter[:users] << user_arr
      end

      project_members.each do |project_member|
        project = [project_member.project.desc, project_member.project_id]
        data_filter[:projects] << project unless data_filter[:projects].include?(project)
      end

      forms = Form.where(_type: "CDS", user_id: user_ids).where.not(status: "New").includes(:period)
      forms.each do |form|
        period = [form.period.format_name, form.period_id]
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
        user_arr = format_filter(user.format_name, user.id)
        role = format_filter(user.role.name, user.role_id)
        data_filter[:companies] << company unless data_filter[:companies].include?(company)
        data_filter[:roles] << role unless data_filter[:roles].include?(role)
        data_filter[:users] << user_arr
      end

      project_members = ProjectMember.where(user_id: user_ids).includes(:project)
      project_members.each do |project_member|
        project = format_filter(project_member.project.desc, project_member.project_id)
        data_filter[:projects] << project unless data_filter[:projects].include?(project)
      end

      forms = Form.where(_type: "CDS", user_id: user_ids).where.not(status: "New").includes(:period)
      forms.each do |form|
        period = format_filter(form.period.format_name, form.period_id)
        data_filter[:periods] << period unless data_filter[:periods].include?(period)
      end

      data_filter
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
      users.each do |user|
        company = format_filter(user.company.name, user.company_id)
        user_arr = format_filter(user.format_name, user.id)
        role = format_filter(user.role.name, user.role_id)
        data_filter[:companies] << company unless data_filter[:companies].include?(company)
        data_filter[:roles] << role unless data_filter[:roles].include?(role)
        data_filter[:users] << user_arr
      end

      project_members.each do |project_member|
        project = format_filter(project_member.project.desc, project_member.project_id)
        data_filter[:projects] << project unless data_filter[:projects].include?(project)
      end

      forms = Form.where(_type: "CDS", user_id: user_ids).where.not(status: "New").includes(:period)
      forms.each do |form|
        period = format_filter(form.period.format_name, form.period_id)
        data_filter[:periods] << period unless data_filter[:periods].include?(period)
      end

      data_filter
    end

    def get_list_cds_assessment(user_id = nil)
      user_id ||= current_user.id
      form = Form.where(user_id: user_id, _type: "CDS", is_delete: false).where.not(status: "Done").includes(:period, :role, :title).order(:id).last
      title_histories = TitleHistory.includes(:period).where(user_id: user_id).order(period_id: :desc)
      list_form = []
      title_histories.each do |title|
        list_form << {
          id: title.id,
          period_name: title.period&.format_name,
          role_name: title.role_name,
          level: title.level,
          rank: title.rank,
          title: title.title,
          status: "Done",
        }
      end
      if form
        list_form.unshift({ id: form.id, period_name: form.period&.format_name || "New", role_name: form.role&.name, rank: form.rank, title: form.title&.name, status: form.status, level: form.level })
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
      slots = Slot.search_slots(params[:search]).joins(:form_slots).where(filter).order(:level, :slot_id)
      hash = {}
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: param[:form_id], slot_id: slots.pluck(:id))
      form_slots = format_form_slot(form_slots)
      arr = []
      slots.map do |slot|
        hash[slot.level] = -1 if hash[slot.level].nil?
        hash[slot.level] += 1
        s = slot_to_hash(slot, hash[slot.level], form_slots)
        if filter_slots[:passed] && s[:tracking][:is_passed]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:failed] && s[:tracking][:recommends].present? && !s[:tracking][:is_passed]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:no_assessment] && s[:tracking][:point].zero?
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:need_to_update] && s[:tracking][:flag] == "yellow"
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        elsif filter_slots[:assessing] && !s[:tracking][:point].zero? && s[:tracking][:recommends].empty?
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
      end
      arr
    end

    def format_data_old_slots
      period = TitleHistory.find(params[:title_history_id]).period_id
      slot_histories = FormSlotHistory.includes(:slot).where(title_history_id: params[:title_history_id], competency_id: params[:competency_id])
      line_managers = LineManager.where(period_id: period, form_slot_id: slot_histories.pluck(:form_slot_id))

      form_slots = get_recommend_by_form_slot(line_managers)
      slot_histories.map do |slot_history|
        h_slot = {
          id: slot_history.slot.id,
          slot_id: slot_history.slot_position,
          desc: slot_history.slot.desc,
          evidence: slot_history.slot.evidence,
          tracking: {
            id: slot_history.form_slot_id,
            evidence: slot_history.evidence || "",
            point: slot_history.point || 0,
            is_commit: false,
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
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        comment = Comment.where(form_slot_id: form_slot.id)
        is_commit = params[:is_commit] == "true"
        if comment.present?
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit)
          form_slot.update(is_change: true)
        else
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id)
          form_slot.update(is_change: true)
        end
      end
    end

    def save_add_more_evidence
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.includes(:line_managers, :comments).find_by(slot_id: params[:slot_id], form_id: params[:form_id])
        comment = form_slot.comments.first
        line_manager = form_slot.line_managers.find_by_flag("yellow")
        return false if line_manager.nil?
        approver = User.find(line_manager.user_id)
        is_commit = params[:is_commit] == "true"
        if comment.present?
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit, flag: "green")
          line_manager.update(flag: "green")
          period = Form.includes(:period).find(params[:form_id]).period
          CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: params[:competency_name], user: current_user, from_date: period.from_date, to_date: period.to_date, reviewer: approver).user_add_more_evidence.deliver_later(wait: 1.minute)
        else
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id)
        end
      end
    end

    def request_add_more_evidence
      line = LineManager.where(form_slot_id: params[:form_slot_id], user_id: current_user.id).first
      form = Form.includes(:period).find(params[:form_id])
      form_slot = FormSlot.includes(:slot).find(params[:form_slot_id])
      competency_name = Competency.find(form_slot.slot.competency_id).name
      user = User.find(params[:user_id])
      if line.nil?
        LineManager.create!(form_slot_id: params[:form_slot_id], flag: "yellow", period_id: form.period_id, user_id: current_user.id)
        comment = Comment.find_by(form_slot_id: params[:form_slot_id])
        comment.nil? ? Comment.create!(form_slot_id: params[:form_slot_id], flag: "yellow") : comment.update(flag: "yellow")
        CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: competency_name, staff: user, from_date: form.period.from_date, to_date: form.period.to_date).reviewer_requested_more_evidences.deliver_now
        return "yellow"
      end

      status = line.flag == "yellow" ? "red" : "yellow"
      line.update(flag: status)
      comment = Comment.find_by(form_slot_id: params[:form_slot_id])
      comment.nil? ? Comment.create!(form_slot_id: params[:form_slot_id], flag: status) : comment.update(flag: status)

      if status == "yellow"
        CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: competency_name, staff: user, from_date: form.period.from_date, to_date: form.period.to_date).reviewer_requested_more_evidences.deliver_now
      else
        CdsAssessmentMailer.with(slot_id: params[:slot_id], competency_name: competency_name, staff: user, recommend: params[:recommend]).reviewer_cancelled_request_more_evidences.deliver_now
      end
      status
    end

    def save_cds_manager
      if params[:recommend] && params[:given_point] && params[:slot_id] && params[:user_id]
        period_id = Form.find(params[:form_id]).period_id
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        line_manager = LineManager.where(user_id: current_user.id, form_slot_id: form_slot.id).first
        if line_manager.present?
          line_manager.update(recommend: params[:recommend], given_point: params[:given_point], period_id: period_id)
        else
          # user_id = Form.where(id: form.id).pluck(:user_id)
          # project_ids = ProjectMember.where(user_id: user_id).pluck(:project_id)
          # user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
          # user_groups = UserGroup.where(user_id: user_ids, group_id: 37).includes(:user)

          # approver = Approver.includes(:approver).where(user_id: params[:user_id])
          # all_line_manager = LineManager.where(form_slot_id: form_slot.id)
          # approver.each do |line, i|
          #   if line.approver.id == current_user.id
          #     LineManager.create!(recommend: params[:recommend], given_point: params[:given_point], user_id: current_user.id, form_slot_id: form_slot.id, period_id: period_id)
          #   else
          #     LineManager.create!(recommend: "", user_id: line.approver.id, form_slot_id: form_slot.id, period_id: period_id)
          #   end
          # end
              LineManager.create!(recommend: params[:recommend], given_point: params[:given_point], user_id: current_user.id, form_slot_id: form_slot.id, period_id: period_id)
          
        end
      end
    end

    def preview_result(form, privilege_array)
      competencies = Competency.where(template_id: form.template_id).order(:location).pluck(:id)
      filter = {
        form_slots: { form_id: form.id },
        competency_id: competencies,
      }

      slots = Slot.includes(:competency).joins(:form_slots).where(filter).order(:level, :slot_id)
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: form.id, slot_id: slots.pluck(:id)).order("line_managers.id desc", "comments.id desc")
      form_slots = get_point_for_result(form_slots)
      h_point = {}
      h_poisition_level = {}
      slots.map do |slot|
        key = slot.competency.name + slot.level.to_s
        h_poisition_level[key] = 0 if h_poisition_level[key].nil?
        h_point[slot.competency.name] = {} if h_point[slot.competency.name].nil?
        data = form_slots[slot.id]
        value = data[:final_point] || data[:point]
        value = data[:point] if data[:is_change]
        if current_user.id != form.user_id
          if privilege_array.include?(REVIEW_CDS)
            value = data[:recommends][current_user.id][:given_point] unless data[:recommends] || data[:recommends][current_user.id]
          elsif privilege_array.include?(APPROVE_CDS)
            value = data[:final_point] || value
          end
        end
        h_slot = {
          value: value,
          type: data[:is_change] ? "assessed" : "new",
          class: "",
        }
        if data[:is_change]
          h_slot[:class] = data[:point] > 2 ? "pass-slot" : "fail-slot"
        end
        unless data[:is_commit]
          h_slot = {
            value: 0,
            type: "new",
            class: "",
          }
        end
        h_point[slot.competency.name][slot.level + LETTER_CAP[h_poisition_level[key]]] = h_slot
        h_poisition_level[key] += 1
      end
      h_point
    end

    def calculate_level_rank(hash_point)
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
        hash[key.to_i][:sum] += value[:value]
        hash[key.to_i][:fail] += 1 if value[:value] < 3
      end

      hash.each do |k, v|
        plp = v[:count] * 5 / 2.0
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

      title_history = TitleHistory.new({ rank: form.rank, title: form.title&.name, level: form.level, role_name: form.role.name, user_id: form.user_id, period_id: form.period_id })
      return "fail" unless title_history.save

      form_slots = FormSlot.joins(:line_managers).includes(:comments, :line_managers).where(form_id: params[:form_id]).where.not(line_managers: { id: nil })
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
      return "fail" unless form.update(status: "Done")
      user = User.find(form.user_id)
      period = Period.find(form.period_id)
      if form.is_approved
        CdsAssessmentMailer.with(staff: user, rank_number:form.rank, level_number:form.level, title_number:form.title&.name, from_date:period.from_date, to_date:period.to_date ).pm_re_approve_cds.deliver_later(wait: 1.minute)
      else 
        CdsAssessmentMailer.with(staff: user, rank_number:form.rank, level_number:form.level, title_number:form.title&.name, from_date:period.from_date, to_date:period.to_date ).pm_approve_cds.deliver_later(wait: 1.minute)
      end
      return "fail" unless form.update(is_approved: true)
      "success"
    end

    def reject_cds
      form = Form.where(id: params[:form_id], status: "Done").where.not(period: nil).first
      return "fail" if form.nil?

      title_history = TitleHistory.where(user_id: params[:user_id]).order(period_id: :desc).first
      return "fail" unless title_history.destroy
      return "fail" unless form.update(status: "Awaiting Approval")
      "success"
    end

    def get_data_view_history
      line_managers = LineManager.where(form_slot_id: params[:form_slot_id])
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
      line = LineManager.find_by(form_slot_id: params[:form_slot_id], flag: "yellow")
      return if line.nil?

      slot = Slot.includes(:competency).joins(:form_slots).find_by(form_slots: { id: params[:form_slot_id] })
      reviewer = User.find(line.user_id)
      comment = Comment.find_by(form_slot_id: params[:form_slot_id])

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

    private

    attr_reader :params, :current_user

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
      h_slot[:tracking] = form_slots[slot.id] if form_slots.present?
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
        recommends = get_recommend(form_slot)
        comments = form_slot.comments.order(created_at: :desc).first
        next unless hash[form_slot.slot_id].nil?

        hash[form_slot.slot_id] = {
          id: form_slot.id,
          evidence: comments&.evidence || "",
          point: comments&.point || 0,
          flag: comments&.flag || "red",
          is_commit: comments&.is_commit,
          is_change: form_slot.is_change,
          final_point: recommends[:final_point],
          is_passed: recommends[:is_passed],
          recommends: recommends[:recommends],
        }
      end
      hash
    end

    def get_recommend(form_slot)
      line_managers = form_slot.line_managers.order(period_id: :desc)
      hash = {
        is_passed: false,
        recommends: [],
      }
      period_id = 0
      form = Form.find(form_slot.form_id)
      user = User.find(form.user_id)
      approvers = Approver.includes(:approver).where(user_id: user.id)
      approvers.each_with_index do |approver, i|
        # line = line_managers[i]
        line = LineManager.find_by(user_id: approver.approver_id,form_slot_id: form_slot.id)
        if line.blank?
          hash[:recommends] << {
            given_point: "",
            recommends: "",
            name: User.find(approver.approver_id).account,
            flag: "red",
            user_id: User.find(approver.approver_id).id,
            is_final: "",
            is_pm: false,
          }
        else
          break if !period_id.zero? && period_id != line.period_id
          period_id = line.period_id
          if line.final && line.given_point > 2
            hash[:is_passed] = true
            hash[:final_point] = line.given_point
          end
          hash[:recommends] << {
            given_point: line.given_point || 0,
            recommends: line.recommend || "",
            name: User.find(line.user_id).account,
            flag: line.flag || "red",
            user_id: line.user_id,
            is_final: line.final,
            is_pm: false,
          }
        end
      end
      hash = get_recommend_appover(hash, form_slot)
    end

    def get_recommend_appover(hash, form_slot)
      period_id = 0
      user_id = Form.where(id: form_slot.form_id).pluck(:user_id)
      project_ids = ProjectMember.where(user_id: user_id).pluck(:project_id)
      user_ids = ProjectMember.where(project_id: project_ids).pluck(:user_id)
      user_groups = UserGroup.where(user_id: user_ids, group_id: 37).includes(:user)
      user_groups.each do |user|
        line = LineManager.find_by(form_slot_id: form_slot, user_id: user.user_id)
        if (line.blank?)
          hash[:recommends] << {
            given_point: "",
            recommends: "",
            name: User.find(user.user_id).account,
            flag: "red",
            user_id: User.find(user.user_id).id,
            is_final: "",
            is_pm: true,
          }
        else
          break if !period_id.zero? && period_id != line.period_id
          period_id = line.period_id
          if line.final && line.given_point > 2
            hash[:is_passed] = true
            hash[:final_point] = line.given_point
          end
          hash[:recommends] << {
            given_point: line.given_point || 0,
            recommends: line.recommend || "",
            name: User.find(line.user_id).account,
            flag: line.flag || "red",
            user_id: line.user_id,
            is_final: line.final,
            is_pm: true,
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
          reviewed_date: line.updated_at.strftime("%d-%m-%Y %H:%M:%S"),
          name: User.find(line.user_id).account,
        }
      end
    end

    def get_recommend_by_form_slot(line_managers)
      hash = {}
      line_managers.map do |line|
        hash[line.form_slot_id] = [] if hash[line.form_slot_id].nil?
        hash[line.form_slot_id] << {
          given_point: line.given_point,
          recommends: line.recommend,
          reviewed_date: line.updated_at.strftime("%d-%m-%Y %H:%M:%S"),
          name: User.find(line.user_id).account,
        }
      end
      hash
    end

    def format_form_cds_review(form)
      {
        id: form.id,
        period_name: form.period&.format_name || "New",
        user_name: form.user&.format_name,
        project: form.user&.get_project,
        email: form.user&.email,
        role_name: form.role&.name,
        level: form.level,
        rank: form.rank,
        title: form.title&.name,
        submit_date: form.submit_date || "",
        review_date: form.review_date || "",
        status: form.status,
        user_id: form.user&.id,
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

      unless params[:user_ids] == "0"
        filter_users[:id] = params[:user_ids].split(",").map(&:to_i)
      end

      unless params[:role_ids] == "0"
        filter_users[:role_id] = params[:role_ids].split(",").map(&:to_i)
      end

      unless params[:company_ids] == "0"
        filter_users[:company_id] = params[:company_ids].split(",").map(&:to_i)
      end

      unless params[:period_ids] == "0"
        filter[:period_id] = params[:period_ids].split(",").map(&:to_i || 0)
      end

      unless params[:project_ids] == "0"
        filter[:project_id] = params[:project_ids].split(",").map(&:to_i || 0)
      end

      filter[:filter_users] = filter_users

      filter
    end

    def get_point_for_result(form_slots)
      hash = {}
      form_slots.map do |form_slot|
        next unless hash[form_slot.slot_id].nil?
        recommends = get_point_manager(form_slot)
        comments = form_slot.comments.first

        hash[form_slot.slot_id] = {
          id: form_slot.id,
          point: comments&.point || 0,
          is_commit: comments&.is_commit,
          is_change: form_slot.is_change,
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
        recommends: [],
        final_point: 0,
      }
      period_id = 0
      line_managers.each do |line|
        break if !period_id.zero? && period_id != line.period_id
        period_id = line.period_id
        if line.final && line.given_point > 2
          hash[:is_passed] = true
          hash[:final_point] = line.given_point
        end
        hash[:recommends] << {
          line.user_id => { given_point: line.given_point || 0,
                            is_final: line.final },
        }
      end
      hash
    end
  end
end
