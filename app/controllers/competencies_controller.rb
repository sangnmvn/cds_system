class CompetenciesController < ApplicationController
  def index
  end

  def new
  end

  def show
  end

  def create
    binding.pry
  end

  def destroy
  end

  def update
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_competency
    @competency = Competency.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def competency_params
    params.require(:conpetency).permit(:id)
  end
end
