class SlotsController < ApplicationController
  layout "system_layout"
  include Authorize
  before_action :get_privilege_id
  def load
    @slots = Slot.where(competency_id: params[:id]).order(:level, :slot_id).ransack(desc_cont: params[:search]).result
    render json: @slots
  end

  def load_competency
    competencies = Competency.where(template_id: params[:template_id]).order(:location)
    render json: competencies
  end

  def new
    return render json: { status: "fail" } unless @privilege_array.include?(9)
    @slot_id = Slot.where(competency_id: params[:competency_id], level: params[:level]).pluck(:slot_id).compact.max.to_i + 1
    @slot = Slot.create(slot_params(@slot_id))
    render json: { errors: @slot.errors }, status: 400 if @slot.invalid?
  end

  def update
    return render json: { status: "fail" } unless @privilege_array.include?(9)
    slot = Slot.find(params[:id])
    slot.update(slot_params) if slot
  end

  def change_slot_id
    return render json: { status: "fail" } unless @privilege_array.include?(9)
    direction = params[:direction]
    id_slot = params[:id]
    result = check_location_slot(id_slot, direction)
    if result != "min" && result != "max"
      slot = Slot.find(id_slot)
      temp = slot[:slot_id]
      slot.update(slot_id: result[:slot_id]) #Hoán vị 2 giá trị slot id của 2 slot cần đổi

      slot_2 = Slot.find(result[:id])
      slot_2.update(slot_id: temp)
      result = "success"
    else
      result = Slot.find(id_slot).level
    end
    respond_to do |format|
      format.json { render json: { status: result } }
    end
  end

  def delete
    return render json: { status: "fail" } unless @privilege_array.include?(9)
    Slot.destroy(params[:id])
  end

  def check_slot_in_template
    @competencies = Competency.where(template_id: params[:template_id]).pluck(:id)
    @slot = Slot.where(competency_id: @competencies).pluck(:competency_id).uniq.count
    # @levels = Slot.where(competency_id: @competencies).pluck(:level).uniq.sort
    # check_level = check_array_level(@levels)
    # render json: @competencies.count > @slot || check_array_level == 0 ? -1 : 1
    render json: @competencies.count > @slot ? -1 : 1
  end

  def update_status_template
    return render json: { status: "fail" } unless @privilege_array.include?(9)
    template = Template.find(params[:template_id])
    template.update(status: 1)
  end

  private

  def slot_params(slot_id = nil)
    param = {
      desc: params[:desc],
      evidence: params[:evidence],
      level: params[:level],
      competency_id: params[:competency_id],
    }
    param[:slot_id] = slot_id if slot_id
    param
  end

  def check_location_slot(id, direction)
    current_slot = Slot.find(id)
    slot_in_level = Slot.where(competency_id: current_slot[:competency_id], level: current_slot[:level]).sort_by { |slot| slot.slot_id }
    if direction == "-1" && current_slot == slot_in_level.first #action up, check slot hiện tại có phải đứng đầu tiên trong level ko
      "min"
    elsif direction == "1" && current_slot == slot_in_level.last #check slot hiện tại có phải đứng cuối trong level ko
      "max"
    else
      slot_in_level[slot_in_level.find_index(current_slot) + direction.to_i] #trả về slot đứng sau của slot hiện tại
    end
  end

  # def check_array_level(array)
  #   return 0 if array[0].to_i != 1
  #   if array.count > 1
  #     for i in 0..array.count
  #       return 0 if array[i].to_i != array[i+1].to_i + 1
  #     end
  #   end
  #   return 1
  # end
end
