class TemplatesController < ApplicationController
  layout "system_layout"

  def index
    @roles = Role.all
    @competencies = Competency.all
  end
end
