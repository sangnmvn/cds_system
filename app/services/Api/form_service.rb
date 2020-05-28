module Api
  class FormService < BaseService
    def initialize(params, current_user)
      @current_user = current_user
      @params = ActiveSupport::HashWithIndifferentAccess.new params
    end

    def get_competencies(form_id = nil)
      form_id = Form.select(:id).find_by(user_id: current_user.id).id if form_id.nil?
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
      # binding.pry
      hash
    end

    def create_form_slot(role_id = nil)
      role_id ||= current_user.role_id
      template_id = Template.find_by(role_id: role_id, status: true)&.id
      return 0 if template_id.nil?
      competency_ids = Competency.where(template_id: template_id).order(:location).pluck(:id)
      slot_ids = Slot.where(competency_id: competency_ids).order(:level, :slot_id).pluck(:id)

      form = Form.new(user_id: current_user.id, _type: "CDS", template_id: template_id, level: 2, rank: 2, title_id: 1002, role_id: 1, status: "New")

      if form.save
        slot_ids.map do |id|
          FormSlot.create!(form_id: form.id, slot_id: id, is_passed: 0)
        end
      end

      form.id
    end

    def get_list_cds_assessment_manager
      forms = Form.where(_type: "CDS").includes(:period, :role, :title).order(id: :desc)
      forms.map do |form|
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
          submit_date: form.submit_date,
          review_date: form.review_date,
          status: form.status,
        }
      end
    end

    def get_list_cds_assessment(user_id = nil)
      user_id ||= current_user.id
      form = Form.where(user_id: user_id, _type: "CDS").where.not(status: "Done").includes(:period, :role, :title).order(:id).last
      title_histories = TitleHistory.includes(:period, :role).where(user_id: user_id).order(period_id: :desc)
      list_form = title_histories.map do |title|
        {
          id: title.id,
          period_name: title.period&.format_name,
          role_name: title.role.name,
          level: title.level,
          rank: title.rank,
          title: title.title,
          status: "Done",
        }
      end
      if form
        list_form.unshift({
          id: form.id,
          period_name: form.period&.format_name || "New",
          role_name: form.role&.name,
          level: form.level,
          rank: form.rank,
          title: form.title&.name,
          status: form.status,
        })
      end
      list_form
    end

    def format_data_slots(param = nil)
      param ||= params
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
        if hash[slot.level].nil?
          hash[slot.level] = -1
        end
        hash[slot.level] += 1
        s = slot_to_hash(slot, hash[slot.level], form_slots)
        if filter_slots["passed"] && s[:tracking][:given_point].present? && s[:tracking][:given_point].max > 2
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
        if filter_slots["failed"] && s[:tracking][:given_point].present? && s[:tracking][:given_point].max < 3
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
        if filter_slots["no_assessment"] && s[:tracking][:evidence].empty?
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
        if filter_slots["need_to_update"] && s[:tracking][:need_to_update]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
        if filter_slots["assessing"]
          arr << slot_to_hash(slot, hash[slot.level], form_slots)
        end
      end
      arr
    end

    def save_cds_staff
      if params[:is_commit].present? && params[:point] && params[:evidence] && params[:slot_id]
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        comment = Comment.where(form_slot_id: form_slot.id)
        is_commit = params[:is_commit] == "true"
        if comment.present?
          comment.update(evidence: params[:evidence], point: params[:point], is_commit: is_commit)
        else
          Comment.create!(evidence: params[:evidence], point: params[:point], is_commit: is_commit, form_slot_id: form_slot.id)
        end
      end
    end

    def save_cds_manager
      if params[:recommend] && params[:given_point] && params[:slot_id]
        form_slot = FormSlot.where(slot_id: params[:slot_id], form_id: params[:form_id]).first
        line_manager = LineManager.where(user_id: current_user.id, form_slot_id: form_slot.id).first
        if line_manager.present?
          line_manager.update(recomend: params[:recommend], given_point: params[:given_point])
        else
          LineManager.create!(recomend: params[:recommend], given_point: params[:given_point], user_id: current_user.id, form_slot_id: form_slot.id)
        end
      end
    end

    def preview_result(form)
      competencies = Competency.where(template_id: form.template_id).order(:location).pluck(:id)
      filter = {
        form_slots: { form_id: form.id },
        competency_id: competencies,
      }

      slots = Slot.includes(:competency).joins(:form_slots).where(filter).order(:level, :slot_id)
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: form.id, slot_id: slots.pluck(:id))
      form_slots = format_form_slot(form_slots)
      hash = {}
      dumy_hash = {}
      slots.map do |slot|
        key = slot.competency.name + slot.level.to_s
        if dumy_hash[key].nil?
          dumy_hash[key] = -1
        end
        dumy_hash[key] += 1
        if hash[slot.competency.name].nil?
          hash[slot.competency.name] = {}
        end
        check = !form_slots[slot.id][:point].zero? && form_slots[slot.id][:given_point].empty?
        h_slot = {
          value: form_slots[slot.id][:point],
          type: check ? "assessed" : "new",
          class: "",
        }
        if check
          h_slot[:class] = form_slots[slot.id][:point] > 2 ? "pass-slot" : "fail-slot"
        end
        hash[slot.competency.name][slot.level + LETTER_CAP[dumy_hash[key]]] = h_slot
      end
      hash
    end

    def approve_cds
      form = Form.find(params[:form_id])
      title_history = TitleHistory.new(rank: form.rank, title: form.title, level: form.level, role_id: form.role_id, user_id: form.user_id, period_id: form.period_id)
      render json: { status: "fail" } unless title_history.save

      slots = Slot.includes(:competency).joins(:form_slots).where({ form_slots: { form_id: params[:form_id] } }).order(:competency, :level, :slot_id)
      form_slots = FormSlot.includes(:comments, :line_managers).where(form_id: params[:form_id])
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
          slot_position: slot.level.to_s + LETTER_CAP[dumy_hash[key]],
        }
        form_slot_history = FormSlotHistory.new(data)
        render json: { status: "fail" } unless form_slot_history.save
        hash[key] += 1
      end
      form.update(status: "Done")
      # sent email
      render json: { status: "success" }
    end

    def get_form
      user_id
      period_id

      #       FormSlotHistory.where(user_id, period_id).pluck(:competency_id)
      #       list_com = Competency.where(id: ids)
      #       form_slot_his = FormSlotHistory.includes(:slot, :tracking).where(competency_id, user_id, period)
      #       form_slot_his.map do |xxx|
      # tracking.where(period, slot.form_slot)
      #         {
      #           xxx.slot.evidence,
      #           xxx.slot.desc,
      #           xxx.evidence,
      #           slot.point,
      #           tracking: slot.tracking,
      #         }
      #       end

    end

    private

    attr_reader :params, :current_user

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
          hash[form_slot.slot_id] = form_slot.comments.present? if hash[form_slot.slot_id].nil?
        end
        return hash
      end
      # binding.pry
      form_slots.map do |form_slot|
        recommends = get_recommend(form_slot.line_managers.order(period_id: :desc))
        comments = form_slot.comments.order(created_at: :desc).first

        if hash[form_slot.slot_id].nil?
          hash[form_slot.slot_id] = {
            evidence: comments&.evidence || "",
            point: comments&.point || 0,
            is_commit: comments&.is_commit,
            recommends: recommends,
          }
        end
      end

      hash
    end

    def get_recommend(line_managers)
      recommends = []
      period_id = 0
      line_managers.map do |line|
        break if !period_id.zero? && period_id != line.period_id
        period_id = line.period_id
        recommends << {
          given_point: line.given_point,
          recommends: line.recommend,
          name: User.find(line.user_id).account,
        }
      end
      recommends
    end

    def filter_cds
      hash = {}
      params[:filter] = "failed,no_assessment,need_to_update,assessing" unless params[:filter].present?
      params[:filter].split(",").map do |p|
        hash[p] = true
      end
      hash
    end
  end
end
