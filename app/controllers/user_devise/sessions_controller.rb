class UserDevise::SessionsController < Devise::SessionsController
  before_action :clear_token, only: [:sign_out, :destroy]

  private

  def clear_token
    Api::AuthService.new.add_deny_list(session[:access_token])
    reset_session
  end
end
