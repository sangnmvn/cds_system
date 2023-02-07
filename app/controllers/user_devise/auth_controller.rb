class UserDevise::AuthController < ApplicationController
  # * verify token
  skip_before_action :authenticate_user!, only: [:index]

  rescue_from 'StandardError' do |err|
    render json: {
      error: err.to_s
    }, status: 500
  end
  rescue_from 'ActionController::ParameterMissing' do |err|
    render json: {
      error: 'MISSING_PARAMS'
    }, status: 400
  end

  # * verify token
  def index
    token = index_params['access_token']
    payload = Api::AuthService.new.decoded_token(token)[0]
    render json: payload
  end

  # * redirect with?token=<token>
  def redirect
    session[:access_token] = Api::AuthService.new.
        valid_or_generate_token(session[:access_token], current_user)
    redirect_to "#{redirect_params[:to]}?token=#{session[:access_token]}"
  end

  # * logout and redirect
  def logout_to
    sign_out(:user)
    Api::AuthService.new.add_deny_list(session[:access_token])
    reset_session
    redirect_to "#{redirect_params[:to]}"
  end

  private

  def redirect_params
    params.require(:to)
    para = params.permit(:to)
    para[:to] = CGI.unescape(para[:to]) # decode uri
    para
  end

  def index_params
    params.require(:access_token)
    params.permit(:access_token)
  end
end
