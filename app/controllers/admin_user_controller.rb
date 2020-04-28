class AdminUserController < ApplicationController
  def index
    @companies = Company.all
    @projects = Project.all
    @roles = Role.all
  end

  def filter_users_management 
    binding.pry
  end
end
