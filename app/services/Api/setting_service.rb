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
      company = Company.includes(:users)
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
          quantity: company_value.users.count || 0,
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
      # if params[:company_id]
      #   project = Project.where(company_id: params[:company_id]).includes(:company, :project_members)
      # else
      project = Project.includes(:company, :project_members)
      # end
      results = []
      project.map do |project_value|
        results << {
          id: project_value.id,
          company_id: project_value.company.id,
          company_name: project_value.company.name || "",
          name: project_value.desc || "",
          abbreviation: project_value.abbreviation || "",
          establishment: project_value.establishment || "",
          closed_date: project_value.closed_date || "",
          project_manager: project_value.project_manager || "",
          customer: project_value.customer || "",
          sponsor: project_value.sponsor || "",
          email: project_value.email || "",
          quantity: project_value.project_members.count || "",
          description: project_value.description || "",
          note: project_value.note || "",
          status: project_value.status || "",
        }
      end
      { data: results }
    end

    def data_setting_role
      role = Role.all
      results = []
      role.map do |role_value|
        results << {
          id: role_value.id,
          name: role_value.desc || "",
          abbreviation: role_value.name || "",
          description: role_value.description || "",
          note: role_value.note || "",
          status: role_value.status || "",
        }
      end
      { data: results }
    end

    def data_setting_title
      title = Title.includes(:role)
      results = []
      title.map do |title_value|
        results << {
          id: title_value.id,
          role_id: title_value.role.id,
          role_name: title_value.role.name || "",
          name: title_value.name || "",
          desc: title_value.desc || "",
          description: title_value.description || "",
          code: title_value.code || "",
          rank: title_value.rank || 0,
          note: title_value.note || "",
          status: title_value.real_status || "",
        }
      end
      { data: results }
    end

    def data_setting_load_company
      Company.pluck(:id, :name)
    end

    def data_setting_load_role
      Role.pluck(:id, :desc)
    end

    def save_setting_company
      hash = {
        name: params[:company_name],
        abbreviation: params[:company_abbreviation],
        establishment: params[:company_establishment],
        phone: params[:company_phone],
        fax: params[:company_fax],
        email: params[:company_email],
        website: params[:company_website],
        address: params[:company_address],
        description: params[:company_description],
        ceo: params[:company_ceo],
        email_group_staff: params[:company_email_group_staff],
        email_group_hr: params[:company_email_group_hr],
        email_group_admin: params[:company_email_group_admin],
        email_group_it: params[:company_email_group_it],
        email_group_fa: params[:company_email_group_fa],
        tax_code: params[:company_tax_code],
        note: params[:company_note],
        parent_company_id: params[:parent_company_id],
      }

      if params[:company_id].blank?
        company = Company.new(hash)
        return company.save
      else
        company = Company.find_by_id(params[:company_id])
        return company.update(hash)
      end
    end

    def save_setting_project
      hash = {
        id: params[:project_id],
        desc: params[:project_name],
        company_id: params[:project_company_name],
        abbreviation: params[:project_abbreviation],
        establishment: params[:project_establishment],
        email: params[:project_email],
        description: params[:project_description],
        note: params[:project_note],
        closed_date: params[:project_closed_date],
        customer: params[:project_customer],
        sponsor: params[:project_sponsor],
        project_manager: params[:project_manager],
      }

      if params[:project_id].blank?
        project = Project.new(hash)
        return project.save
      else
        project = Project.find_by_id(params[:project_id])
        return project.update(hash)
      end
    end

    def save_setting_role
      hash = {
        id: params[:role_id],
        desc: params[:role_name],
        name: params[:role_abbreviation],
        description: params[:role_description],
        note: params[:role_note],
      }
      if params[:role_id].blank?
        role = Role.new(hash)
        return role.save
      else
        role = Role.find_by_id(params[:role_id])
        return role.update(hash)
      end
    end

    def save_setting_title
      hash = {
        id: params[:title_id],
        desc: params[:title_name],
        role_id: params[:title_role_name],
        name: params[:title_abbreviation],
        code: params[:title_code],
        rank: params[:title_rank],
        description: params[:title_description],
        note: params[:title_note],
      }

      if params[:title_id].blank?
        title = Title.new(hash)
        return title.save
      else
        title = Title.find_by_id(params[:title_id])
        return title.update(hash)
      end
    end

    private

    attr_reader :current_user, :params
  end
end
