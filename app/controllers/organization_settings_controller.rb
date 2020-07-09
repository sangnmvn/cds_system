class OrganizationSettingsController < ApplicationController
  layout "system_layout"
  before_action :setting_services

  def data_setting_company
    render json: @setting_services.data_setting_company
  end

  def data_setting_project
    render json: @setting_services.data_setting_project
  end

  def data_setting_role
    render json: @setting_services.data_setting_role
  end

  def data_setting_title
    render json: @setting_services.data_setting_title
  end

  def data_setting_load_company
    render json: @setting_services.data_setting_load_company
  end

  def data_setting_load_role
    render json: @setting_services.data_setting_load_role
  end

  def save_setting_company
    if params[:company_id].blank?
      return render json: { status: "exist" } if Company.where(name: params[:company_name]).present?
    end
    return render json: { status: "success" } if @setting_services.save_setting_company
    render json: { status: "fail" }
  end

  def save_setting_project
    if params[:project_id].blank?
      return render json: { status: "exist" } if Project.includes(:company).where(desc: params[:project_name], "companies.id": params[:company_id]).present?
    end
    return render json: { status: "success" } if @setting_services.save_setting_project
    render json: { status: "fail" }
  end

  def save_setting_title
    if params[:title_id].blank?
      return render json: { status: "exist" } if Title.where(name: params[:title_name]).present?
    end
    return render json: { status: "success" } if @setting_services.save_setting_title
    render json: { status: "fail" }
  end

  def save_setting_role
    if params[:role_id].blank?
      return render json: { status: "exist" } if Role.where(name: params[:role_name]).present?
    end
    return render json: { status: "success" } if @setting_services.save_setting_role
    render json: { status: "fail" }
  end

  def status_setting_company
    company = Company.find_by_id(params[:company_id])
    status = !company.status
    if company.status
      return render json: { status: "success", change: status } if company.update(status: 0)
    else
      return render json: { status: "success", change: status } if company.update(status: 1)
    end
    render json: { status: "fail" }
  end

  def status_setting_project
    project = Project.find_by_id(params[:project_id])
    status = !project.status
    if project.status
      return render json: { status: "success", change: status } if project.update(status: 0)
    else
      return render json: { status: "success", change: status } if project.update(status: 1)
    end
    render json: { status: "fail" }
  end

  def status_setting_role
    role = Role.find_by_id(params[:role_id])
    status = !role.status
    if role.status
      return render json: { status: "success", change: status } if role.update(status: 0)
    else
      return render json: { status: "success", change: status } if role.update(status: 1)
    end
    render json: { status: "fail" }
  end

  def status_setting_title
    title = Title.find_by_id(params[:title_id])
    status = !title.real_status
    if title.real_status
      return render json: { status: "success", change: status } if title.update(real_status: 0)
    else
      return render json: { status: "success", change: status } if title.update(real_status: 1)
    end
    render json: { status: "fail" }
  end

  def delete_setting_company
    return render json: { status: "success" } if Company.destroy(params[:company_id])
    render json: { status: "fail" }
  end

  def delete_setting_project
    return render json: { status: "success" } if Project.destroy(params[:project_id])
    render json: { status: "fail" }
  end

  def delete_setting_role
    return render json: { status: "success" } if Role.destroy(params[:role_id])
    render json: { status: "fail" }
  end

  def delete_setting_title
    return render json: { status: "success" } if Title.destroy(params[:title_id])
    render json: { status: "fail" }
  end

  private

  def setting_services
    @setting_services = Api::SettingService.new(form_params, current_user)
  end

  def form_params
    params.permit(
      :company_id, :company_name, :company_abbreviation, :company_establishment, :company_phone, :company_fax, :company_email, :company_website, :company_address, :company_description, :company_ceo, :company_tax_code, :company_note, :company_quantity, :company_email_group_staff, :company_email_group_hr, :company_email_group_fa, :company_email_group_it, :company_email_group_admin, :parent_company_id,
      :project_id, :project_name, :project_company_name, :project_abbreviation, :project_establishment, :project_email, :project_address, :project_description, :project_note, :project_quantity, :project_closed_date, :project_customer, :project_sponsor, :project_manager,
      :role_id, :role_name, :role_abbreviation, :role_description, :role_note,
      :title_id, :title_name, :title_role_name, :title_abbreviation, :title_code, :title_rank, :title_address, :title_description, :title_note
    )
  end
end
