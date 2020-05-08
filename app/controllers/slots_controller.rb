class SlotsController < ApplicationController

  def load_slot
    search = params[:search]
    if search
      @slots = Slot.where(competency_id: params[:id]).ransack(desc_cont: search).result
    else
      @slots = Slot.where(competency_id: params[:id]).order(:level, :slot_id)
    end
    render json: @slots
  end

  def new_slot
    @slot_id = Slot.where(competency_id: params[:competency_id], level: params[:level]).pluck(:slot_id).compact.max.to_i + 1
    @slot = Slot.new(slot_params(@slot_id))
    render json: {errors: @slot.errors }, status: 400 if @slot.invalid?
    render json: @slot.id if @slot.save!
  end

  def update_slot
    slot = Slot.find(params[:id])
    slot.update(slot_params) if slot
    render json: "1" #repsonse success
  end

  def change_slot_id
    direction = params[:direction]
    id_slot = params[:id]
    result = check_location_slot(id_slot, direction)
    # if result == "available"
    #   # slot = Slot.find(id_slot)
    #   # slot.update()
    # end
    render json: result
  end

  def delete_slot
    Slot.destroy(params[:id])
    render json: "1"
  end

  def check_slot_in_template
    @competencies = Competency.where(template_id: params[:template_id]).pluck(:id)
    @competencies.each { |competency|
      slots = Slot.find_by(competency_id: competency)
      if slots.blank?     
        render json: "-1"
        return
      end
    }  
    render json: "1"
  end

  def update_status_template
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

  def check_location_slot (id,direction)
    
    # binding.pry
    
    level = Slot.find(id).level
    competency_id = Slot.find(id).competency_id
    slot_id =   Slot.find(id).slot_id
    slot_ids = Slot.where(competency_id: competency_id, level: level).pluck(:slot_id).minmax 
    if slot_id == slot_ids[0] && direction == "-1"
      "min"
    elsif slot_id == slot_ids[1] && direction == "1"
      "max"
    else
      "available"
    end
  end
end
