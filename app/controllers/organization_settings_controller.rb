class OrganizationSettingsController < ApplicationController
  layout "system_layout"
  before_action :organization_settings_services

  def data_company
    render json: @organization_settings.data_company
  end

  def data_project
    render json: @organization_settings.data_project
  end

  def data_role
    render json: @organization_settings.data_role
  end

  def data_title
    render json: @organization_settings.data_title
  end

  def data_load_company
    render json: @organization_settings.data_load_company
  end

  def data_load_role
    render json: @organization_settings.data_load_role
  end

  def save_company
    if params[:company_id].blank?
      return render json: { status: "exist" } if Company.where(name: params[:company_name]).present?
    end
    return render json: { status: "success" } if @organization_settings.save_company
    render json: { status: "fail" }
  end

  def save_project
    if params[:project_id].blank?
      return render json: { status: "exist" } if Project.includes(:company).where(desc: params[:project_name], "companies.id": params[:company_id]).present?
    end
    return render json: { status: "success" } if @organization_settings.save_project
    render json: { status: "fail" }
  end

  def save_title
    if params[:title_id].blank?
      return render json: { status: "exist" } if Title.where(name: params[:title_name]).present?
    end
    return render json: { status: "success" } if @organization_settings.save_title
    render json: { status: "fail" }
  end

  def save_role
    if params[:role_id].blank?
      return render json: { status: "exist" } if Role.where(name: params[:role_name]).present?
    end
    return render json: { status: "success" } if @organization_settings.save_role
    render json: { status: "fail" }
  end

  def change_status_company
    company = Company.find_by_id(params[:company_id])
    status = !company.status
    return render json: { status: "success", change: status } if company.update(status: status)
    render json: { status: "fail" }
  end

  def change_status_project
    project = Project.find_by_id(params[:project_id])
    status = !project.status
    return render json: { status: "success", change: status } if project.update(status: status)
    render json: { status: "fail" }
  end

  def change_status_role
    role = Role.find_by_id(params[:role_id])
    status = !role.status
    return render json: { status: "success", change: status } if role.update(status: status)
    render json: { status: "fail" }
  end

  def change_status_title
    title = Title.find_by_id(params[:title_id])
    status = !title.real_status
    return render json: { status: "success", change: status } if title.update(real_status: status)
    render json: { status: "fail" }
  end

  def delete_company
    company = Company.find_by_id(params[:company_id])
    if company.nil?
      render json: { status: "fail" }
    else
      return render json: { status: "success" } if Company.destroy(params[:company_id])
    end
  end

  def delete_project
    project = Project.find_by_id(params[:project_id])
    if project.nil?
      render json: { status: "fail" }
    else
      return render json: { status: "success" } if Project.destroy(params[:project_id])
    end
  end

  def delete_role
    role = Role.find_by_id(params[:role_id])
    if role.nil?
      render json: { status: "fail" }
    else
      return render json: { status: "success" } if Role.destroy(params[:role_id])
    end
  end

  def delete_title
    title = Title.find_by_id(params[:title_id])
    if title.nil?
      render json: { status: "fail" }
    else
      return render json: { status: "success" } if Title.destroy(params[:title_id])
    end
  end

  private

  def organization_settings_services
    @organization_settings = Api::OrganizationSettingsService.new(organization_settings_params, current_user)
  end

  def organization_settings_params
    params.permit(
      :company_id, :company_name, :company_abbreviation, :company_establishment, :company_phone, :company_fax, :company_email, :company_website, :company_address, :company_description, :company_ceo, :company_tax_code, :company_note, :company_quantity, :company_email_group_staff, :company_email_group_hr, :company_email_group_fa, :company_email_group_it, :company_email_group_admin, :parent_company_id, :project_id, :project_name, :project_company_name, :project_abbreviation, :project_establishment, :project_email, :project_address, :project_description, :project_note, :project_quantity, :project_closed_date, :project_customer, :project_sponsor, :project_manager, :role_id, :role_name, :role_abbreviation, :role_description, :role_note, :title_id, :title_name, :title_role_name, :title_abbreviation, :title_code, :title_rank, :title_address, :title_description, :title_note
    )
  end
end
