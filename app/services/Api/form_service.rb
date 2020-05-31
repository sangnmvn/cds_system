# frozen_string_literal: true

module Api
  class FormService < BaseService
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
            levels: {}
          }
        end
        if hash[key][:levels][slot.level].nil?
          hash[key][:levels][slot.level] = {
            total: 0,
            current: 0
          }
        end
        hash[key][:levels][slot.level][:total] += 1
        hash[key][:levels][slot.level][:current] += 1 if form_slots[slot.id]
      end
      hash
    end

    def get_old_competencies
      competency_ids = FormSlotHistory.where(title_history_id: params[:title_history_id]).pluck(:competency_id).uniq
      competencies = Competency.where(id: competency_ids)
      hash = {}
      competencies.map do |competency|
        hash[competency.name] = {
          type: competency.sort_type,
          id: competency.id,
          levels: {}
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

      form = Form.new(user_id: current_user.id, _type: 'CDS', template_id: template_id, level: 2, rank: 2, title_id: 1002, role_id: 1, status: 'New', is_delete: false)

      if form.save
        slot_ids.map do |id|
          FormSlot.create!(form_id: form.id, slot_id: id, is_passed: 0)
        end
      end

      form
    end

    def get_list_cds_assessment_manager
      user_to_approve_ids = Approver.where(approver_id: current_user.id).distinct.pluck(:user_id)
      forms = Form.where(_type: 'CDS').includes(:period, :role, :title).order(id: :desc).where.not(user_id: current_user.id).where(user_id: user_to_approve_ids)
      forms.map do |form|
        {
          id: form.id,
          period_name: form.period&.format_name || 'New',
          user_name: form.user&.format_name,
          project: form.user&.get_project,
          email: form.user&.email,
          role_name: form.role&.name,
          level: form.level,
          rank: form.rank,
          title: form.title&.name,
          submit_date: form.submit_date,
          review_date: form.review_date,
          status: form.status
        }
      end
    end

    def get_list_cds_assessment(user_id = nil)
      user_id ||= current_user.id
      form = Form.where(user_id: user_id, _type: 'CDS', is_delete: false).where.not(status: 'Done').includes(:period, :role, :title).order(:id).last
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
          status: 'Done'
        }
      end
      if form
        list_form.unshift({ id: form.id, period_name: form.period&.format_name || 'New', role_name: form.role&.name, rank: form.rank, title: form.title&.name, status: form.status })
      end
      list_form
    end

    def format_data_slots(param = nil)
      param ||= params
      return format_data_old_slots if params[:title_history_id].present?

      filter_slots = filter_cds
      filter = {
        form_slots: { form_id: param[:form_id] },
        competency_id: param[:competency_id]
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
        elsif filter_slots[:need_to_update] && s[:tracking][:flag] == 'yellow'
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
            evidence: slot_history.evidence || '',
            point: slot_history.point || 0,
            is_commit: false
          }
        }
        if form_slots.present?
          h_slot[:tracking][:recommends] = form_slots[slot_history.form_slot_id]
        end

        h_slot
      end
    end

    def save_cds_staff
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        comment = Comment.where(form_slot_id: form_slot.id)
        is_commit = params[:is_commit] == 'true'
        if comment.present?
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit)
        else
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id)
        end
      end
    end

    def save_add_more_evidence
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.includes(:line_managers, :comments).find_by(slot_id: params[:slot_id], form_id: params[:form_id])
        comment = form_slot.comments.first
        line_manager = form_slot.line_managers.find_by_flag('yellow')
        approver = User.find(line_manager.user_id)
        is_commit = params[:is_commit] == 'true'
        if comment.present?
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit, flag: 'green')
          line_manager.update(flag: 'green')
          period = Form.includes(:period).find(params[:form_id]).period
          CdsAssessmentMailer.with(slot_id: params[:slot_id], competance_name: params[:competance_name], user: current_user, from_date: period.from_date, to_date: period.to_date, reviewer: approver).user_add_more_evidence.deliver_now
        else
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id)
        end
      end
    end

    def save_cds_manager
      if params[:recommend] && params[:given_point] && params[:slot_id]
        period_id = Form.find(form_id: params[:form_id]).period_id
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        line_manager = LineManager.where(user_id: current_user.id, form_slot_id: form_slot.id).first
        if line_manager.present?
          line_manager.update(recomend: params[:recommend], given_point: params[:given_point], period_id: period_id)
        else
          LineManager.create!(recomend: params[:recommend], given_point: params[:given_point], user_id: current_user.id, form_slot_id: form_slot.id, period_id: period_id)
        end
      end
    end

    def preview_result(form)
      competencies = Competency.where(template_id: form.template_id).order(:location).pluck(:id)
      filter = {
        form_slots: { form_id: form.id },
        competency_id: competencies
      }

      slots = Slot.includes(:competency).joins(:form_slots).where(filter).order(:level, :slot_id)
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: form.id, slot_id: slots.pluck(:id))
      form_slots = format_form_slot(form_slots)
      hash = {}
      dumy_hash = {}
      slots.map do |slot|
        key = slot.competency.name + slot.level.to_s
        dumy_hash[key] = -1 if dumy_hash[key].nil?
        dumy_hash[key] += 1
        hash[slot.competency.name] = {} if hash[slot.competency.name].nil?
        check = !form_slots[slot.id][:point].zero? && form_slots[slot.id][:recommends].empty?
        h_slot = {
          value: form_slots[slot.id][:point],
          type: check ? 'assessed' : 'new',
          class: ''
        }
        if check
          h_slot[:class] = form_slots[slot.id][:point] > 2 ? 'pass-slot' : 'fail-slot'
        end
        hash[slot.competency.name][slot.level + LETTER_CAP[dumy_hash[key]]] = h_slot
      end
      hash
    end

    def approve_cds
      form = Form.find(params[:form_id])
      return 'fail' if form.status == 'Done' || form.period_id.nil?

      title_history = TitleHistory.new({ rank: form.rank, title: form.title&.name, level: form.level, role_name: form.role.name, user_id: form.user_id, period_id: form.period_id })
      return 'fail' unless title_history.save

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
          slot_position: slot.level.to_s + LETTER_CAP[hash[key]]
        }
        form_slot_history = FormSlotHistory.new(data)
        return 'fail' unless form_slot_history.save

        hash[key] += 1
      end
      form.update(status: 'Done')
      # sent email
      'success'
    end

    def get_data_view_history
      line_managers = LineManager.where(form_slot_id: params[:form_slot_id])
      recommends = get_recommend_by_period(line_managers)
      slot_histories = FormSlotHistory.joins(:title_history).where(form_slot_id: params[:form_slot_id])
      hash = {}
      slot_histories.map do |h|
        hash[h.title_history.period.format_name] = {
          evidence: h.evidence || '',
          point: h.point || 0,
          recommends: recommends
        }
      end
      hash
    end

    def get_data_form_slot
      line = LineManager.find_by(form_slot_id: params[:form_slot_id], flag: 'yellow')
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
        comment_evidence: comment.evidence
      }
    end

    private

    attr_reader :params, :current_user

    def slot_to_hash(slot, location, form_slots)
      h_slot = {
        id: slot.id,
        slot_id: slot.level + LETTER_CAP[location],
        desc: slot.desc,
        evidence: slot.evidence
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
        recommends = get_recommend(form_slot.line_managers.order(period_id: :desc))
        comments = form_slot.comments.order(created_at: :desc).first
        next unless hash[form_slot.slot_id].nil?

        hash[form_slot.slot_id] = {
          id: form_slot.id,
          evidence: comments&.evidence || '',
          point: comments&.point || 0,
          flag: comments&.flag || 'red',
          is_commit: comments&.is_commit,
          is_passed: recommends[:is_passed],
          recommends: recommends[:recommends]
        }
      end

      hash
    end

    def get_recommend(line_managers)
      hash = {
        is_passed: false,
        recommends: []
      }
      period_id = 0
      line_managers.map do |line|
        break if !period_id.zero? && period_id != line.period_id

        period_id = line.period_id
        hash[:is_passed] = true if line.final && line.given_point > 2
        hash[:recommends] << {
          given_point: line.given_point,
          recommends: line.recommend,
          name: User.find(line.user_id).account,
          flag: line.flag || 'red',
          user_id: line.user_id,
          is_final: line.final
        }
      end

      hash
    end

    def get_recommend_by_period(line_managers)
      line_managers.map do |line|
        {
          given_point: line.given_point,
          recommends: line.recommend,
          reviewed_date: line.updated_at.strftime('%d-%m-%Y %H:%M:%S'),
          name: User.find(line.user_id).account
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
          reviewed_date: line.updated_at.strftime('%d-%m-%Y %H:%M:%S'),
          name: User.find(line.user_id).account
        }
      end
      hash
    end

    def filter_cds
      hash = {}
      params[:filter].split(',').map do |filter|
        hash[filter.to_sym] = true
      end
      hash
    end
  end
end
