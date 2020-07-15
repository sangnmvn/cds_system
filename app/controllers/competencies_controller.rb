class CompetenciesController < ApplicationController
  layout "system_layout"
  before_action :get_privilege_id
  before_action :set_competency, :check_edit, only: [:show, :edit, :update, :edit, :destroy]
  before_action :redirect_to_index
  before_action :check_edit, except: [:load]
  FULL_ACCESS_RIGHT = 9
  VIEW_ACCESS_RIGHT = 10
  def create
    if Competency.where(name: params[:name].squish!, template_id: params[:template_id]).present?
      render json: { status: "exist" }
    else
      location_max = Competency.where(template_id: params[:template_id]).map(&:location).max
      params[:location] = location_max.nil? ? 1 : location_max + 1
      competency = Competency.new(competency_params)
      if competency.save
        render json: { status: "success", id: competency.id, name: competency.name, desc: competency.desc, type: competency._type }
      else
        render json: { status: "fail" }
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
      return render json: { status: "exist" }
    else
      if @competency.update(competency_params)
        return render json: { status: "success", id: @competency.id, name: @competency.name, type: @competency._type, desc: @competency.desc }
      else
        return render json: { status: "fail" }
      end
    end
  end

  def load
    competencies = Competency.select(:id, :name, :_type, :desc).where(template_id: params[:id]).order(location: :asc)
    render json: competencies
  end

  def edit
    return render json: { status: "fail" } unless @competency.present?
    render json: { status: "success", id: @competency.id, name: @competency.name, desc: @competency.desc, type: @competency._type }
  end

  def change_location
    competency_current = Competency.find(params[:id])

    return render json: { status: "fail" } if competency_current.nil?
    location_current = competency_current.location
    template_id_current = competency_current.template_id
    if params[:type] == "up"
      location_new = Competency.where(template_id: template_id_current).where("location < #{location_current}").pluck(:location).max
    elsif params[:type] == "down"
      location_new = Competency.where(template_id: template_id_current).where("location > #{location_current}").pluck(:location).min
    end

    return render json: { status: "fail" } if location_new.nil?

    Competency.where(template_id: template_id_current, location: location_new).update(location: location_current)
    competency_current.update(location: location_new)
    render json: { status: "success" }
  end

  def check_privileges
    return render json: { privileges: "full" } if @privilege_array.include?(FULL_ACCESS_RIGHT)
    return render json: { privileges: "view" } if @privilege_array.include?(VIEW_ACCESS_RIGHT)
    return render json: { location: root_path }
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

  def check_edit
    render json: { status: "fail" } unless @privilege_array.include?(FULL_ACCESS_RIGHT)
  end

  def redirect_to_index
    redirect_to root_path unless @privilege_array.include?(FULL_ACCESS_RIGHT) || @privilege_array.include?(VIEW_ACCESS_RIGHT)
  end
end
