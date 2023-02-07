module Api
  class AuthService < BaseService
    HEADER_FIELDS = {
      alg: 'HS256',
      typ: 'JWT',
    }
    SECRET_KEY =  '123QWEasd'

    def encode_token(payload, exp = 1.hours.from_now, secret_key = SECRET_KEY)
      raise 'INVALID_INPUT' if payload.blank?
      payload[:exp] = exp.to_i
      JWT.encode(payload, secret_key, 'HS256',HEADER_FIELDS)
    end

    # * Return [payload, header]
    def decoded_token(token, secret_key = SECRET_KEY)
      begin
        raise 'DENY_TOKEN' if JwtDenyList.find_by(jwt: token).present?
        JWT.decode(token, secret_key, true, algorithm: 'HS256')
      # rescue JWT::ExpiredSignature
      #   raise 'TIME_EXPIRED'
      rescue JWT::DecodeError, StandardError
        raise 'INVALID_TOKEN'
      end
    end

    def add_deny_list(token)
      begin
        payload = self.decoded_token(token)[0] # raise if invalid token
        exp = payload['exp'].present? ? Time.at(payload['exp']).to_datetime : nil
        JwtDenyList.create!({
            jwt: token,
            exp: exp
          })
      rescue StandardError => e
        return                 # no need to save invalid token
      end
    end

    # * if valid token => return argument
    # * else return new token
    # @params token: string
    def valid_or_generate_token(token, user)
      self.decoded_token(token)
      return token
    rescue
      # generate new token
      time_exp = user.remember_created_at.present? ?
          user.remember_created_at + Devise.remember_for :
          Devise.timeout_in.from_now
      access_token = Api::AuthService.new.encode_token({
        id: user.id,
        is_admin: user.account == "admin"
      }, time_exp)
    end

    #
    def clear_deny_token_exp
      JwtDenyList.where("exp < '#{DateTime.now}'").delete_all
    end
  end
end
