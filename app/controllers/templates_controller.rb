class TemplatesController < ApplicationController
  layout "system_layout"

  def index
    @roles = Role.all
  end
end
