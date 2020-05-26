class PeriodsController < ApplicationController
  def show
    @period = Period.find(params[:id])
  end
end
