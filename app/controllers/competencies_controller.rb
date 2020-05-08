class CompetenciesController < ApplicationController
  before_action :set_competency, only: [:show, :edit, :update, :load_data_edit, :destroy]

  def index
  end

  def new
  end

  def show
  end

  def create
    respond_to do |format|
      if Competency.where(name: params[:name]).where(template_id: params[:template_id]).present?
        format.json { render json: { status: "exist" } }
      else
        location_max = Competency.where(template_id: params[:template_id]).map(&:location).max
        params[:location] = location_max.nil? ? 1 : location_max + 1
        @competency = Competency.new(competency_params)
        if @competency.save
          format.json { render :json => { status: "success", id: @competency.id, name: @competency.name, desc: @competency.desc, type: @competency._type } }
        else
          format.json { render :json => { status: "fail" } }
        end
      end
    end
  end

  def destroy
    if @competency.destroy
      render :json => { status: "success" }
    else
      render :json => { status: "fail" }
    end
  end

  def update
    if Competency.where.not(id: params[:id]).where(name: params[:name]).present?
      render :json => { status: "exist" }
    else
      if @competency.update(competency_params)
        render :json => { status: "success", id: @competency.id, name: @competency.name, type: @competency._type, desc: @competency.desc }
      else
        render :json => { status: "fail" }
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
      render :json => { status: "success", id: @competency.id, name: @competency.name, desc: @competency.desc, type: @competency._type }
    else
      render :json => { status: "fail" }
    end
  end

  def change_location
    eval(params[:type] + " " + params[:id])
  end

  def up(id)
    if @competency_current = Competency.find(id)
      location_current = @competency_current.location
      template_id_current = @competency_current.template_id
      locaion_previous = Competency.where(template_id: template_id_current).map(&:location).select { |x| x < location_current }.max
      id_previous = Competency.select("id").where(template_id: template_id_current, location: locaion_previous)
      @competency_previous = Competency.find(id_previous[0].id)
      @competency_current.update!(location: locaion_previous)
      @competency_previous.update!(location: location_current)
      render :json => { status: "success" }
    else
      render :json => { status: "fail" }
    end
  end

  def down(id)
    if @competency_current = Competency.find(id)
      location_current = @competency_current.location
      template_id_current = @competency_current.template_id
      locaion_next = Competency.where(template_id: template_id_current).map(&:location).select { |x| x > location_current }.min
      id_next = Competency.select("id").where(template_id: template_id_current, location: locaion_next)
      @competency_next = Competency.find(id_next[0].id)
      @competency_current.update!(location: locaion_next)
      @competency_next.update!(location: location_current)
      render :json => { status: "success" }
    else
      render :json => { status: "fail" }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_competency
    @competency = Competency.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def competency_params
    params.permit(:name, :_type, :desc, :template_id, :location)
  end
end
