module Api
  class SettingService < BaseService
    def initialize(params, current_user)
      groups = Group.joins(:user_group).where(user_groups: { user_id: current_user.id })
      privilege_array = []
      groups.each do |group|
        privilege_array += group&.list_privileges
      end
      @privilege_array = privilege_array
      @current_user = current_user
      @params = params
    end

    def data_setting_company
      company = Company.all
      results = []
      company.map do |company_value|
        results << {
          id: company_value.id,
          name: company_value.name,
          abbreviation: company_value.abbreviation || "",
          establishment: company_value.establishment || "",
          phone: company_value.phone || "",
          fax: company_value.fax || "",
          email: company_value.email || "",
          website: company_value.website || "",
          address: company_value.address || "",
          description: company_value.description || "",
          ceo: company_value.ceo || "",
          quantity: User.where(company_id: company_value.id).count || 0,
          email_group_staff: company_value.email_group_staff || "",
          email_group_hr: company_value.email_group_hr || "",
          email_group_fa: company_value.email_group_fa || "",
          email_group_it: company_value.email_group_it || "",
          email_group_admin: company_value.email_group_admin || "",
          tax_code: company_value.tax_code || "",
          note: company_value.note || "",
          parent_company_id: company_value.parent_company_id,
          status: company_value.status || "",
        }
      end
      { data: results }
    end

    def data_setting_project
      if params[:company_ids]
        project = Project.where(company_id: params[:company_ids])
      else
        project = Project.all
      end
      results = []
      project.map do |project_value|
        results << {
          company_name: Company.find(project_value.company_id).name || "",
          name: project_value.desc || "",
          abbreviation: project_value.abbreviation || "",
          establishment: project_value.establishment || "",
          closed_date: project_value.closed_date || "",
          project_manager: project_value.project_manager || "",
          customer: project_value.customer || "",
          sponsor: project_value.sponsor || "",
          email: project_value.email || "",
          quantity: User.where(company_id: project_value.id).count || "",
          description: project_value.description || "",
          note: project_value.note || "",
        }
      end
      { data: results }
    end

    def data_setting_role
      role = Role.all
      results = []
      role.map do |role_value|
        results << {
          name: role_value.desc || "",
          abbreviation: role_value.name || "",
          description: role_value.description || "",
          note: role_value.note || "",
        }
      end
      { data: results }
    end

    def data_setting_title
      title = Title.all
      results = []
      title.map do |title_value|
        results << {
          role_name: Role.find(title_value.role_id).name || "",
          name: title_value.name || "",
          abbreviation: title_value.abbreviation || "",
          description: title_value.description || "",
          note: title_value.note || "",
        }
      end
      { data: results }
    end

    def data_setting_load_company
      Company.all
    end

    def save_setting_companys
      if params[:company_id].blank?
        company = Company.new(name: params[:company_name], abbreviation: params[:company_abbreviation], establishment: params[:company_establishment], phone: params[:company_phone], fax: params[:company_fax], email: params[:company_email], website: params[:company_website], address: params[:company_address], description: params[:company_description], ceo: params[:company_ceo], email_group_staff: params[:company_email_group_staff], email_group_hr: params[:company_email_group_hr], email_group_admin: params[:company_email_group_admin], email_group_it: params[:company_email_group_it], email_group_fa: params[:company_email_group_fa], tax_code: params[:company_tax_code], note: params[:company_note], status: 0, parent_company_id: params[:parent_company_id])
        return true if company.save
      else
        company = Company.find(params[:company_id])
        return true if company.update(name: params[:company_name], abbreviation: params[:company_abbreviation], establishment: params[:company_establishment], phone: params[:company_phone], fax: params[:company_fax], email: params[:company_email], website: params[:company_website], address: params[:company_address], description: params[:company_description], ceo: params[:company_ceo], email_group_staff: params[:company_email_group_staff], email_group_hr: params[:company_email_group_hr], email_group_admin: params[:company_email_group_admin], email_group_it: params[:company_email_group_it], email_group_fa: params[:company_email_group_fa], tax_code: params[:company_tax_code], note: params[:company_note], status: 0, parent_company_id: params[:parent_company_id])
      end
      return false
    end

    private

    attr_reader :current_user, :params, :privilege_array

    # def filter_users
    #   filter = {
    #     status: true,
    #     is_delete: false,
    #   }

    #   filter[:company_id] = params[:company_id].split(",").map(&:to_i) if params[:company_id].present? && params[:company_id] != "All"
    #   filter[:role_id] = params[:role_id].split(",").map(&:to_i) if params[:role_id].present? && params[:role_id] != "All"
    #   filter[:project_members] = { project_id: params[:project_id].split(",").map(&:to_i) } if params[:project_id].present? && params[:project_id] != "All"

    #   filter
    # end
  end
end
