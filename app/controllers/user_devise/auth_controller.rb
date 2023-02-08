class UserDevise::AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :refresh_token]
  protect_from_forgery unless: -> { request.format.json? }

  rescue_from 'StandardError' do |err|
    render json: {
      error: err.to_s,
      backtrace: err.backtrace
    }, status: 500
  end
  rescue_from 'ActionController::ParameterMissing' do |err|
    render json: {
      error: 'MISSING_PARAMS'
    }, status: 400
  end

  # * verify token
  def index
    token = token_params['token']
    payload = Api::AuthService.new.decode_access_token(token)[0]
    render json: payload
  end

  # * return new token
  def refresh_token
    access_token = Api::AuthService.new.refresh_access_token(token_params['token'])
    render json: {
      access_token: access_token
    }
  end

  # * redirect with url?access=<token>&refresh=<token>
  def redirect
    auth_service = Api::AuthService.new
    refresh_token = auth_service.generate_refresh_token({id: current_user.id})
    access_token = auth_service.refresh_access_token(refresh_token)
    redirect_to "#{redirect_params[:to]}?access=#{access_token}&refresh=#{refresh_token}"
  end



  private

  def redirect_params
    params.require(:to)
    para = params.permit(:to)
    para[:to] = CGI.unescape(para[:to]) # decode uri
    para
  end

  def token_params
    params.require(:token)
    params.permit(:token)
  end

end
