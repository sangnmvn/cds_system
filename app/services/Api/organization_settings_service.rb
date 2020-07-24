module Api
  class OrganizationSettingsService < BaseService
    def initialize(params, current_user)
      @current_user = current_user
      @params = params
    end

    def data_company
      company = Company.includes(:users, :projects)
      results = []
      company.map do |company_value|
        is_not_used = company_value.users.count == 0 && company_value.projects.count == 0 && Schedule.find_by_company_id(company_value.id).nil?
        establishment = company_value.establishment.nil? ? "" : company_value.establishment.to_date.to_s(:long)
        results << {
          id: company_value.id,
          name: company_value.name,
          abbreviation: company_value.abbreviation || "",
          establishment: establishment,
          phone: company_value.phone || "",
          fax: company_value.fax || "",
          email: company_value.email || "",
          website: company_value.website || "",
          address: company_value.address || "",
          desc: company_value.desc || "",
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
          is_enabled: company_value.is_enabled || "",
          is_not_used: is_not_used,
        }
      end
      { data: results }
    end

    def data_project
      project = Project.includes(:company, :project_members)
      results = []
      project.map do |project_value|
        is_not_used = project_value.project_members.count == 0 && Schedule.find_by_project_id(project_value.id).nil?
        establishment = project_value.establishment.nil? ? "" : project_value.establishment.to_date.to_s(:long)
        closed_date = project_value.closed_date.nil? ? "" : project_value.closed_date.to_date.to_s(:long)
        results << {
          id: project_value.id,
          company_id: project_value.company.id,
          company_name: project_value.company.name || "",
          name: project_value.name || "",
          abbreviation: project_value.abbreviation || "",
          establishment: establishment,
          closed_date: closed_date,
          project_manager: project_value.project_manager || "",
          customer: project_value.customer || "",
          sponsor: project_value.sponsor || "",
          email: project_value.email || "",
          quantity: project_value.project_members.count || "",
          desc: project_value.desc || "",
          note: project_value.note || "",
          is_enabled: project_value.is_enabled || "",
          is_not_used: is_not_used,
        }
      end
      { data: results }
    end

    def data_role
      role = Role.includes(:users, :titles, :templates)
      results = []
      role.map do |role_value|
        is_not_used = role_value.users.count == 0 && role_value.titles.count == 0 && role_value.templates.count == 0
        results << {
          id: role_value.id,
          name: role_value.name || "",
          abbreviation: role_value.abbreviation || "",
          desc: role_value.desc || "",
          note: role_value.note || "",
          is_enabled: role_value.is_enabled || "",
          is_not_used: is_not_used,
        }
      end
      { data: results }
    end

    def data_title
      title = Title.includes(:role, :level_mappings, :title_mappings)
      results = []
      title.map do |title_value|
        is_not_used = title_value.level_mappings.count == 0 && title_value.title_mappings.count == 0
        results << {
          id: title_value.id,
          role_id: title_value.role.id,
          role_name: title_value.role.name || "",
          name: title_value.name || "",
          abbreviation: title_value.abbreviation || "",
          desc: title_value.desc || "",
          rank: title_value.rank || 0,
          note: title_value.note || "",
          is_enabled: title_value.is_enabled || "",
          is_not_used: is_not_used,
        }
      end
      { data: results }
    end

    def data_load_company
      Company.pluck(:id, :name)
    end

    def data_load_role
      Role.pluck(:id, :name)
    end

    def save_company
      hash = {
        name: params[:company_name],
        abbreviation: params[:company_abbreviation],
        establishment: params[:company_establishment],
        phone: params[:company_phone],
        fax: params[:company_fax],
        email: params[:company_email],
        website: params[:company_website],
        address: params[:company_address],
        desc: params[:company_desc],
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

    def save_project
      hash = {
        id: params[:project_id],
        name: params[:project_name],
        company_id: params[:project_company_name],
        abbreviation: params[:project_abbreviation],
        establishment: params[:project_establishment],
        email: params[:project_email],
        desc: params[:project_desc],
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

    def save_role
      hash = {
        id: params[:role_id],
        name: params[:role_name],
        abbreviation: params[:role_abbreviation],
        desc: params[:role_desc],
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

    def save_title
      hash = {
        id: params[:title_id],
        name: params[:title_name],
        role_id: params[:title_role_name],
        abbreviation: params[:title_abbreviation],
        rank: params[:title_rank],
        desc: params[:title_desc],
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
