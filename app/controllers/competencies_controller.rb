class CompetenciesController < ApplicationController
  before_action :set_competency, only: [:show, :edit, :update, :load_data_edit, :destroy]

  def create
    respond_to do |format|
      if Competency.where(name: params[:name].squish!).where(template_id: params[:template_id]).present?
        format.json { render json: { status: "exist" } }
      else
        location_max = Competency.where(template_id: params[:template_id]).map(&:location).max
        params[:location] = location_max.nil? ? 1 : location_max + 1
        @competency = Competency.new(competency_params)
        if @competency.save
          format.json { render json: { status: "success", id: @competency.id, name: @competency.name, desc: @competency.desc, type: @competency._type } }
        else
          format.json { render json: { status: "fail" } }
        end
      end
    end
  end

  def destroy
    if @competency.destroy
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  def update
    if Competency.where.not(id: params[:id]).where(name: params[:name].squish!).present?
      render json: { status: "exist" }
    else
      if @competency.update(competency_params)
        render json: { status: "success", id: @competency.id, name: @competency.name, type: @competency._type, desc: @competency.desc }
      else
        render json: { status: "fail" }
      end
    end
  end

  def load
    competencies = Competency.select(:id, :name, :_type, :desc)
      .where(template_id: params[:id]).order(location: :asc)
    arr = Array.new
    competencies.each { |kq|
      arr << {
        id: kq.id,
        name: kq.name,
        type: kq._type,
        desc: kq.desc,
      }
    }
    render json: arr
  end

  def load_data_edit
    if @competency
      render json: { status: "success", id: @competency.id, name: @competency.name, desc: @competency.desc, type: @competency._type }
    else
      render json: { status: "fail" }
    end
  end

  def change_location
    # eval(params[:type] + " " + params[:id])
    if competency_current = Competency.find(params[:id])
      location_current = competency_current.location
      template_id_current = competency_current.template_id
      if params[:type] == "up"
        location_new = Competency.where(template_id: template_id_current)
          .map(&:location).select { |x| x < location_current }.max
      elsif params[:type] == "down"
        location_new = Competency.where(template_id: template_id_current)
          .map(&:location).select { |x| x > location_current }.min
      end
      id_previous = Competency.select("id").where(template_id: template_id_current, location: location_new)
      competency_new = Competency.find(id_previous[0].id)
      competency_current.update!(location: location_new)
      competency_new.update!(location: location_current)
      render json: { status: "success" }
    else
      render json: { status: "fail" }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_competency
    @competency = Competency.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def competency_params
    params.permit(:id, :name, :_type, :desc, :template_id, :location)
  end
end
