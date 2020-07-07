class CategoryManagementController < ApplicationController
  layout "root_layout"
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

  def save_setting_company
    return render json: { status: "success" } if @setting_services.save_setting_company
    render json: { status: "fail" }
  end

  def status_setting
    company = Company.find(params[:company_id])
    if company.status == 2
      status = true
    else
      status = false
    end
    if company.status == 2
      check_company_schedule = Schedule.where(company_id: company.id)
      check_company_project = Project.where(company_id: company.id)
      check_company_user = User.where(company_id: company.id)
      if !check_company_schedule.blank? || !check_company_project.blank? || !check_company_user.blank?
        return render json: { status: "success", change: status } if company.update(status: 0)
      else
        return render json: { status: "success", change: status } if company.update(status: 1)
      end
    else
      return render json: { status: "success", change: status } if company.update(status: 2)
    end
    render json: { status: "fail" }
  end

  private

  def setting_services
    @setting_services = Api::SettingService.new(form_params, current_user)
  end

  def form_params
    params.permit(:company_ids, :role_ids, :company_id, :company_name, :company_abbreviation, :company_establishment, :company_phone, :company_fax, :company_email, :company_website, :company_address, :company_description, :company_ceo, :company_tax_code, :company_note, :company_quantity, :company_email_group_staff, :company_email_group_hr, :company_email_group_fa, :company_email_group_it, :company_email_group_admin, :parent_company_id)
  end
end
