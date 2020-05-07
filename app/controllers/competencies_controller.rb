class CompetenciesController < ApplicationController
  before_action :set_competency, only: [:show, :edit, :update, :load_data_edit, :destroy]

  def index
  end

  def new
  end

  def show
  end

  def create
    @competency = Competency.new(competency_params)
    respond_to do |format|
      if Competency.where(name: params[:name]).where(template_id: params[:template_id]).present?
        format.json { render json: { status: "exist" } }
      else
        if @competency.save
          format.json { render :json => { status: "success", id: @competency.id, name: @competency.name, desc: @competency.desc, type: @competency._type } }
        else
          format.json { render :json => { status: "fail" } }
        end
      end
    end
  end

  def destroy
    if @competency.update(is_delete: true)
      render :json => { status: "success" }
    else
      render :json => { status: "fail" }
    end
  end

  def update
    respond_to do |format|
      if Competency.where.not(id: params[:id]).where(name: params[:name]).present?
        format.json { render :json => { status: "exist" } }
      else
        if @competency.update(competency_params)
          # binding.pry
          format.json {
            render :json => { status: "success", id: @competency.id, name: @competency.name, type: @competency._type, desc: @competency.desc }
          }
        else
          format.json { render :json => { status: "fail" } }
        end
      end
    end
  end

  def load
    competencies = Competency.select(:id, :name, :_type, :desc)
      .where(template_id: params[:id], is_delete: false).order(_type: :asc)
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

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_competency
    @competency = Competency.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def competency_params
    params.permit(:name, :_type, :desc, :template_id)
  end
end
