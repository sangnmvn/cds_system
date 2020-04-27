ActiveAdmin.register_page "Dashboard" do
  menu false
  
  controller do
    def ajax_call
      binding.pry
      @company = Company.find(params[:company])
      respond_to do |format|
        format.js { @company = @company }
        # format.json { render json: @company }
      end
    end
  end
  content title: proc { I18n.t("active_admin.dashboard") } do
    # div class: "blank_slate_container", id: "dashboard_default_message" do
    #   span class: "blank_slate" do
    #     span I18n.t("active_admin.dashboard_welcome.welcome")
    #     small I18n.t("active_admin.dashboard_welcome.call_to_action")
    #   end
    # end

    columns do
      column do
        # binding.pry
        all_project = Project.left_outer_joins(:project_members).select("projects.id,projects.desc,COUNT(project_members.id) AS count\
        ").group("projects.id").order("id asc")
        hash_all_project = {}
        all_project.each { |x| hash_all_project[x["desc"]] = x["count"] }
        # adminuser = { "Project 1" => 2, 2 => 2, 4 => 1, 5 => 2, 6 => 4 }
        column_chart hash_all_project
      end
    end
    columns do
      # Project.joins(project_members: [admin_user: [:role, :company]])
      #       Project.joins(project_members: [admin_user: [:role, :company]]).
      # elect("companies.name,projects.desc,admin_users.first_name,admin_users.last_name,
      # dmin_users.email,roles.name")
      # 2 phần / 5 phần
      column span: 5 do
        panel "Projects" do
          # table_for Project.left_outer_joins(:project_members).select("projects.id,projects.desc,COUNT(project_members.id) AS count\
          # ").group("projects.id").order("id asc") do
          x = Project.joins(project_members: [admin_user: [:role, :company]])
            .select("companies.name AS company_name,projects.desc,admin_users.first_name,admin_users.last_name,
              admin_users.email,roles.name,project_members.created_at")
          paginated_collection(x.page(params[:users_page]).per(5), param_name: "users_page", download_links: false) do
            table_for(collection) do
              i = 0
              column("No.") { i += 1 }
              column("Company Name") { |u| u.company_name }
              column("Project Name") { |u| u.desc }
              column("Full Name") { |u| u.first_name + " " + u.last_name }
              column("Mail") { |u| u.email }
              column("Role") { |u| u.name }
              column("Title")
              column("Join Date") { |u| u.created_at.strftime("%b-%d, %Y") }
              # column("") { render html: "<button>view</button>".html_safe }
            end
          end
        end
      end
      column span: 2 do
        # section "Search Project", :priority => 4 do
        panel "Filter" do
          # binding.pry
          projects = Project.all
          companies = Company.all
          render partial: "search_project", locals: { projects: projects, companies: companies }
          # render html: "
          #   <select>
          #     <option></option>
          #   </select>".html_safe
        end
        # end

        # scope = Project.all
        # active_admin_filters_form_for scope.search(params[:q]) do |f|
        #   f.input :desc
        # end

      end
    end
    # Users
    columns do
      column do
        panel "Atalink" do
          arr_atalink = []
          atalink = AdminUser.joins(:role).select("roles.desc,COUNT(admin_users.role_id) as count").group(:role_id).where("company_id = 2")
          atalink.each { |x| arr_atalink << [x["desc"], x["count"]] }
          pie_chart arr_atalink
        end
      end
      column do
        panel "Atalink" do
          i = 0
          table_for AdminUser.joins(:role).select("roles.desc,COUNT(admin_users.role_id) as count").group(:role_id).where("company_id = 2") do
            column("No.") { i += 1 }
            column("Project Name") { |u| u.desc }
            column("Total Members") { |u| u.count }
          end
        end
      end
    end
    columns do
      column do
        panel "Bestarion" do
          arr_bestarion = []
          bestarion = AdminUser.joins(:role).select("roles.desc,COUNT(admin_users.role_id) as count").group(:role_id).where("company_id = 3")
          bestarion.each { |x| arr_bestarion << [x["desc"], x["count"]] }
          pie_chart arr_bestarion, donut: true
        end
      end
      column do
        panel "Bestarion" do
          i = 0
          table_for AdminUser.joins(:role).select("roles.desc,COUNT(admin_users.role_id) as count").group(:role_id).where("company_id = 3") do
            column("No.") { i += 1 }
            column("Project Name") { |u| u.desc }
            column("Total Members") { |u| u.count }
          end
        end
      end
    end
    columns do
      column do
        panel "Larion" do
          arr_larion = []
          larion = AdminUser.joins(:role).select("roles.desc,COUNT(admin_users.role_id) as count").group(:role_id).where("company_id = 4")
          larion.each { |x| arr_larion << [x["desc"], x["count"]] }
          pie_chart arr_larion
        end
      end
      column do
        panel "Larion" do
          i = 0
          table_for AdminUser.joins(:role).select("roles.desc,COUNT(admin_users.role_id) as count").group(:role_id).where("company_id = 4") do
            column("No.") { i += 1 }
            column("Project Name") { |u| u.desc }
            column("Total Members") { |u| u.count }
          end
        end
      end
    end
  end # content
end
