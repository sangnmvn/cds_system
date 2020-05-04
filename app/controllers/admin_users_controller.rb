class AdminUsersController < ApplicationController
  layout "system_layout"
  @@filter_company = nil
  @@filter_project = nil
  @@filter_role = nil

  before_action :set_admin_user, only: [:update, :status, :destroy]

  def get_user_data
    user_per_page = 20
    offset = params["iDisplayStart"].to_i

    @companies = Company.all
    @roles = Role.all
    @project_members = ProjectMember.all
    @projects = Project.all

    @admin_users = AdminUser.offset(offset).limit(user_per_page).where(is_delete: false).order(:id => :desc)

    unless params["sSearch"].empty?
      @admin_users = @admin_users.where("email LIKE ? OR account LIKE ? OR first_name LIKE ? OR last_name LIKE ?", \
        "%#{params["sSearch"]}%", "%#{params["sSearch"]}%", "%#{params["sSearch"]}%", "%#{params["sSearch"]}%")
    end

    unless @@filter_company.nil?
      @admin_users = @admin_users.where("company_id=?", @@filter_company)
    end

    unless @@filter_role.nil?
      @admin_users = @admin_users.where("role_id=?", @@filter_role)
    end

    unless @@filter_project.nil?
      if @@filter_project == "none"
        list_id_user_project = ProjectMember.left_outer_joins(:admin_user).pluck("admin_users.id") # user have project
        unless list_id_user_project.empty?
          @admin_users = @admin_users.where("id not in (?)", list_id_user_project)
        end
      else
        list_id_user_project = (@admin_users.joins(:project_members).where("project_id=?", @@filter_project)).pluck("id") # user have project

        unless list_id_user_project.empty?
          @admin_users = @admin_users.where("id in (?)", list_id_user_project)
        end
      end
    end

    final_data = []
    @admin_users.each_with_index { |user, index|
      current_user_data = []
      current_user_data.push("<td class='selectable'><div class='resource_selection_cell'><input type='checkbox' id='batch_action_item_#{user.id}' value='0' class='collection_selection' name='collection_selection[]'></div></td>")
      current_user_data.push("<p class='number'>#{(offset + index + 1)}</p>")
      current_user_data.push(user.first_name)
      current_user_data.push(user.last_name)
      current_user_data.push(user.email)
      current_user_data.push(user.account)

      begin
        role = user.role_id.nil? ? "" : @roles.find(user.role_id).name
      rescue
        next
      end

      current_user_data.push(role)
      title = ""
      current_user_data.push(title)

      begin
        project_namelist = []
        project_member_of_user = @project_members.where(admin_user_id: user.id)
        project_member_of_user.each { |project_member|
          project_name = @projects.find(project_member.project_id).desc
          project_namelist.append(project_name)
        }
        # end project
        projects = project_namelist.join(" / ")
      rescue
        # end project
        projects = ""
      end

      current_user_data.push(projects)

      begin
        company = user.company_id.nil? ? "" : @companies.find(user.company_id).name
      rescue
        next
      end

      current_user_data.push(company)
      

      # action
      current_user_data.push("<a class='action_icon edit_icon' data-user_id='#{user.id}' href='#'><img border='0' 
        src='/assets/edit-2e62ec13257b111c7f113e2197d457741e302c7370a2d6c9ee82ba5bd9253448.png'></a> 
        <a class='action_icon delete_icon' data-toggle='modal' data-target='#deleteModal' data-user_id='#{user.id}' href=''>
        <img border='0' src='/assets/destroy-7e988fb1d9a8e717aebbc559484ce9abc8e9095af98b363008aed50a685e87ec.png'></a> 
        <a class='action_icon add_reviewer_icon' data-toggle='modal' data-target='#addReviewerModal' data-user_id='#{user.id}' data-user_account='#{user.account}' href='#'>
        <img border='0' src='/assets/add_reviewer-be172df592436b4918ff55747fad8ecb1376cabb7ab1cafd5c16594611a9c640.png'></a> 
        <a class='action_icon status_icon' data-user_id='#{user.id}' data-user_account='#{user.account}' href='#'><i class='fa fa-toggle-#{user.status ? "on" : "off"}' styl='color:white'></i></a>")

      final_data.push(current_user_data)
    }

    respond_to do |format|
      format.json { render :json => { iTotalRecords: @admin_users.count, iTotalDisplayRecords: @admin_users.unscope([:limit, :offset]).count, aaData: final_data } }
    end
  end

  def index
    @companies = Company.all.order(:name)
    @projects = Project.all.order(:desc)
    @roles = Role.all.order(:name)
    @admin_users = AdminUser.where(is_delete: false).order(:id => :desc)
    @project_members = ProjectMember.all

    # reset filter
    @@filter_company = nil
    @@filter_project = nil
    @@filter_role = nil

    respond_to do |format|
      format.html
    end
  end

  def add_reviewer
    user_id = params[:id]
    all_user_id_except_self = AdminUser.where.not(id: user_id)
    @existing_reviewers = all_user_id_except_self.where(id: Approver.where(admin_user_id: user_id).distinct.pluck(:approver_id))
    @available_admin_users = all_user_id_except_self.where.not(id: @existing_reviewers.pluck(:id))

    respond_to do |format|
      format.js
    end
  end

  def add_reviewer_to_database
    if params["approver_ids"] == "none"
      approver_ids = []
    else
      approver_ids = params["approver_ids"].split(",").map(&:to_i)
    end
    user_id = params["id"].to_i
    # delete approver not in list
    (Approver.where(admin_user_id: user_id)).where.not(approver_id: approver_ids).destroy_all
    # add approver in list
    approver_ids.each { |approver_id|
      Approver.create!(admin_user_id: user_id, approver_id: approver_id)
    }
  end

  def destroy
    params[:is_delete] = true
    respond_to do |format|
      if @admin_user.update(admin_user_params)
        format.json { render :json => { status: "success", deleted_id: params[:id] } }
      else
        format.json { render :json => { status: "fail" } }
      end
    end
  end

  def get_filter_company
    if params[:company] == "all"
      projects = Project.select(:id, :desc).all
      roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
    else
      projects = Project.select(:id, :desc).where("company_id = ?", params[:company])
      roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]])
        .where("projects.company_id = ?", params[:company])
    end
    respond_to do |format|
      format.json { render :json => { :projects => projects.order(:desc), :roles => roles.order(:name) } }
    end
  end

  def get_filter_project
    @roles = Role.select(:id, :name).distinct.joins(admin_users: [project_members: [project: :company]]).order(:name)
    if params[:company] != "all"
      @roles = @roles.where("projects.company_id = ?", params[:company])
    end
    if params[:project] != "all" && params[:project] != "none"
      @roles = @roles.where("projects.id = ?", params[:project])
    end
    if params[:project] == "none"
      list_id_user_project = ProjectMember.left_outer_joins(:admin_user).pluck("admin_users.id") # user have project
      unless list_id_user_project.empty?
        list_role_id_user_not_project = AdminUser.where("id not in (?)", list_id_user_project).pluck("role_id").uniq
        @roles = @roles.find(list_role_id_user_not_project)
      end
    end
    respond_to do |format|
      format.json { render :json => { :roles => @roles } }
    end
  end

  # add
  def add
    password_default = "123QWEasd"
    management_default = 0
    @use_new = AdminUser.new(email: params[:email], password: password_default, first_name: params[:first],
                             last_name: params[:last], account: params[:account],
                             company_id: params[:company], role_id: params[:role])
    respond_to do |format|
      email = AdminUser.where(email: params[:email]).present?
      account = AdminUser.where(account: params[:account]).present?
      if email || account
        format.json { render :json => { status: "exist", email: email, account: account } }
      else
        if @use_new.save
          id_user_new = AdminUser.select("id").where("email = ?", params[:email])
          unless params[:project].nil?
            params[:project].each do |id|
              ProjectMember.create!(admin_user_id: id_user_new[0].id, project_id: id.to_i, is_managent: management_default)
            end
          end
          user = AdminUser.select("admin_users.id,first_name,last_name,email,account,roles.name as r,companies.name as c").joins(:company).joins(:role).where(id: id_user_new)
          project_user = ProjectMember.select("projects.desc").joins(:project).where(admin_user_id: id_user_new).map(&:desc).join(" / ")
          format.json { render :json => { status: "success", user: user, project_user: project_user } }
        else
          format.json { render :json => { status: "fail" } }
        end
      end
    end
  end

  # get data modal edit
  def edit
    user = AdminUser.select(:id, :first_name, :last_name, :email, :account, :role_id, :company_id).where(id: params[:id])
    companies = Company.select(:id, :name).all
    projects = Project.select(:id, :desc).where(company_id: user[0]["company_id"])
    roles = Role.select(:id, :name).all
    project_user = ProjectMember.joins(:admin_user, :project).select("projects.id").where(admin_user_id: params[:id]).map(&:id)
    respond_to do |format|
      format.json { render :json => { companies: companies, projects: projects, roles: roles, user: user, project_user: project_user } }
    end
  end

  # modal company
  def get_modal_project
    @projects = Project.where(company_id: params[:company])
    respond_to do |format|
      format.json { render :json => { :projects => @projects } }
    end
  end

  # submit
  def submit_filter
    @roles = Role.all
    @projects = Project.all
    @companies = Company.all

    @@filter_company = params[:company]
    @@filter_role = params[:role]
    @@filter_project = params[:project]

    @@filter_company = nil if @@filter_company == "all"
    @@filter_role = nil if @@filter_role == "all"
    @@filter_project = nil if @@filter_project == "all"

    respond_to do |format|
      format.js
    end
  end

  def update
    email_exist = AdminUser.where.not(id: params[:id]).where(email: params[:email]).present? ? true : false
    account_exist = AdminUser.where.not(id: params[:id]).where(account: params[:account]).present? ? true : false
    respond_to do |format|
      if email_exist || account_exist
        format.json { render :json => { :status => "exist", :email_exist => email_exist, :account_exist => account_exist } }
      else
        if @admin_user.update(admin_user_params)
          project_user = ProjectMember.joins(:admin_user, :project).select("project_members.id,projects.id")
            .where(admin_user_id: params[:id]).map(&:id)
          password_default = "password"
          management_default = 0
          if params[:project].nil? && !project_user.empty?
            ProjectMember.find_by(admin_user_id: params[:id]).destroy
            # delete all
          elsif project_user.empty? && !params[:project].nil?
            params[:project].each do |pro|
              ProjectMember.create!(admin_user_id: params[:id], project_id: pro.to_i, is_managent: management_default)
            end
          elsif !project_user.empty? && !params[:project].nil?
            params[:project].each do |pro|
              if pro.to_i.in?(project_user)
                project_user.delete(pro.to_i)
              else
                ProjectMember.create!(admin_user_id: params[:id], project_id: pro.to_i, is_managent: management_default)
              end
            end
            unless project_user.empty?
              project_user.each do |old|
                ProjectMember.find_by(admin_user_id: params[:id], project_id: old).delete
              end
            end
          end

          user = AdminUser.find(params[:id])
          user_role = user.role_id.nil? ? "" : Role.find(user.role_id).name
          # placeholder
          user_title = ""
          project_namelist = []
          project_member_of_user = ProjectMember.where(admin_user: user)

          project_member_of_user.each { |project_member|
            project_name = Project.find(project_member.project_id).desc
            project_namelist.append(project_name)
          }
          user_project_name = project_namelist.join(" / ")

          begin
            company = Company.find(user.company_id).name
          rescue
            company = ""
          end

          format.json { render :json => { :status => "success", :edit_user_id => params[:id], :first_name => user.first_name, :last_name => user.last_name, :email => user.email, :account => user.account, :role => user_role, :projects => user_project_name, :title => user_title, :company => company } }
        else
          format.json { render :json => { :status => "fail" } }
        end
      end
    end
  end

  def delete_multiple_users
    respond_to do |format|
      if params[:list_users].nil?
        format.json { render :json => { :status => "fail" } }
      else
        params[:list_users].each do |u|
          user = AdminUser.find(u.to_i)
          if user
            user.update(is_delete: true)
            format.json { render :json => { :status => "success", users: params[:list_users] } }
          else
            format.json { render :json => { :status => "fail" } }
          end
        end
      end
    end
  end

  def disable_multiple_users
    respond_to do |format|
      if params[:list_users].nil?
        format.json { render :json => { :status => "fail" } }
      else
        params[:list_users].each do |u|
          user = AdminUser.find(u.to_i)
          if user
            user.update(status: false)
            format.json { render :json => { :status => "success", users: params[:list_users] } }
          else
            format.json { render :json => { :status => "fail" } }
          end
        end
      end
    end
  end

  # change status user (enable / disable)
  def status
    params[:status] = @admin_user.status ? false : true
    respond_to do |format|
      if @admin_user.update(admin_user_params)
        format.json { render :json => { status: "success", change: params[:status] } }
      else
        format.json { render :json => { status: "fail" } }
      end
    end
  end

  private

  def set_admin_user
    @admin_user = AdminUser.find(params[:id])
  end

  def admin_user_params
    params.permit(:id, :first_name, :last_name, :email, :account, :company_id, :role_id, :status, :is_delete)
  end
end
