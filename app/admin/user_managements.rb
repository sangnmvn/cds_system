ActiveAdmin.register_page "User Management" do
  menu false
  controller do
    def filter_users_management
      @company = params[:company]
      @project = params[:project]
      if params[:company] == "all" && params[:project] == "all"
        @projects = Project.all
        @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
      elsif params[:company] != "all" && params[:project] == "all"
        @projects = Project.all.where("company_id = ?", params[:company])
        @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
          .where("projects.company_id = ?", params[:company])
      elsif params[:company] == "all" && params[:project] != "all"
        @projects = Project.all
        @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
          .where("projects.id = ?", params[:project])
      elsif params[:company] != "all" && params[:project] != "all"
        @projects = Project.all.where("company_id = ?", params[:company])
        @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
          .where("projects.id = ? and projects.company_id = ?", params[:project], params[:company])
      end
      # binding.pry
      respond_to do |format|
        format.js { }
      end
    end

    # add
    def add_users_management
      password_default = "password"
      management_default = 0
      # params.require(:admin_user).permit(:email)
      @use_new = AdminUser.new(email: params[:email], password: password_default, first_name: params[:first],
                               last_name: params[:last], account: params[:account],
                               company_id: params[:company], role_id: params[:role])
      respond_to do |format|
        if @use_new.save
          unless params[:project].nil?
            id_user_new = AdminUser.select("id").where("email = ?", params[:email])
            params[:project].each do |id|
              ProjectMember.create!(admin_user_id: id_user_new[0].id, project_id: id.to_i, is_managent: management_default)
            end
          end
          @status = true
          # format.html { redirect_to admin_user_management_url }
          format.js { }
        else
          format.js { }
        end
      end
    end

    #search
    def search_users_management
      # binding.pry
      q = params[:q]
      @current_page = params[:page] || "1"
      @current_page = @current_page.to_i
      @total_page = (AdminUser.where("email LIKE ? OR account LIKE ?", "%#{q}%", "%#{q}%").count / 20.to_f).ceil
      @roles = Role.all
      @projects = Project.all
      @project_members = ProjectMember.all
      @companies = Company.all
      @admin_users = AdminUser.offset((@current_page - 1) * 20).limit(10).where("email LIKE ? OR account LIKE ?", "%#{q}%", "%#{q}%")
      respond_to do |format|
        format.js { }
      end
    end

    # submit
    def submit_filter_users_management
      @current_page = params[:page] || "1"
      @current_page = @current_page.to_i
      @total_page = (AdminUser.count / 20.to_f).ceil
      @roles = Role.all
      @projects = Project.all
      @project_members = params[:project] == "all" ? ProjectMember.all : ProjectMember.all.where("project_id = ?", params[:project])
      @companies = Company.all

      if params[:company] == "all" && params[:role] == "all"
        @admin_users = AdminUser.offset((@current_page - 1) * 20).limit(10)
      elsif params[:company] != "all" && params[:role] == "all"
        @admin_users = AdminUser.offset((@current_page - 1) * 20).limit(10).where("company_id = ?", params[:company])
      elsif params[:company] == "all" && params[:role] != "all"
        @admin_users = AdminUser.offset((@current_page - 1) * 20).limit(10).where("role_id = ?", params[:role])
      elsif params[:company] != "all" && params[:role] != "all"
        @admin_users = AdminUser.offset((@current_page - 1) * 20).limit(10).where("company_id = ? and role_id = ?", params[:company], params[:role])
      end
      respond_to do |format|
        format.js
      end
    end

    # modal company
    def get_project_modal_users_management
      # binding.pry
      @projects = Project.where(company_id: params[:company])
      respond_to do |format|
        format.js
      end
    end
  end

  content do
    columns do
      column span: 2 do
        roles = Role.all
        companies = Company.all
        project_name = Project.select("projects.id,projects.desc").all
        render partial: "action", locals: { roles: roles, companies: companies, project_name: project_name }
      end
      # search
      column span: 8 do
        render partial: "search"
      end
    end
    columns do
      # filter
      column span: 2 do
        panel "Filter" do
          # binding.pry
          projects = Project.all
          companies = Company.all
          roles = Role.all
          render partial: "filter", locals: { projects: projects, companies: companies, roles: roles }
        end
      end
      # table
      column span: 8 do
        current_page = params[:page] || "1"
        current_page = current_page.to_i
        total_page = (AdminUser.count / 20.to_f).ceil
        admin_users = AdminUser.offset((current_page - 1) * 20).limit(20)
        roles = Role
        projects = Project
        project_members = ProjectMember
        companies = Company
        panel "Projects" do
          div class: "table-user-management" do
            render partial: "admin_users", locals: { admin_users: admin_users, roles: roles, projects: projects, project_members: project_members, companies: companies }
          end
          div class: "paging-user-management" do
            render partial: "paging", locals: { current_page: current_page, total_page: total_page }
          end
        end
      end
    end
  end
end
