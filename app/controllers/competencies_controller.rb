class CompetenciesController < ApplicationController
  before_action :set_competency, only: [:show, :edit, :update, :destroy]

  def index
  end

  def new
  end

  def show
  end

  def create
    # binding.pry
    @competency = Competency.new(competency_params)
    respond_to do |format|
      if Competency.where(name: params[:name]).where(template_id: params[:template_id]).present?
        format.json { render :json => { status: "exist" } }
      else
        if @competency.save
          format.json { render :json => { status: "success" } }
        else
          format.json { render :json => { status: "fail" } }
        end
      end
    end
  end

  def destroy
  end

  def update
  end

  def load
    competencies = Competency.select(:id, :name, :_type, :desc).where(template_id: params[:id])
    # binding.pry
    arr = Array.new
    competencies.each { |kq|
      arr << {
        id: kq.id,
        name: kq.name,
        type: kq._type,
        desc: kq.desc,
      }
    }
    respond_to do |format|
      # if competency.empty?
      format.json { render :json => { competencies: arr } }
      # else
      #   format.json { render :json => { competency: competency } }
      # end
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
