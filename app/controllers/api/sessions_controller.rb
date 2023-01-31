class Api::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!
  skip_before_action :verify_authenticity_token
  # protect_from_forgery
  # layout 'devise'
  def new
    @redirect = params[:redirect]
    super
  end

  def create
    render json: {success: true}
  end
end
