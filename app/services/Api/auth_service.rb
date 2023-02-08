module Api
  class AuthService < BaseService
    HEADER_FIELDS = {
      alg: 'HS256',
      typ: 'JWT',
    }
    ACCESS_KEY_SECRET =  '123QWEasd'
    REFRESH_KEY_SECRET =  '123QWEasd@'

    # @params payload is hash include id, ex: payload = {id :1}
    def generate_refresh_token(payload, exp = 2.weeks.from_now)
      self.encode_token(payload, exp, REFRESH_KEY_SECRET)
    end

    def refresh_access_token(refresh_token, exp = 30.minutes.from_now)
      payload = self.decoded_token(refresh_token, REFRESH_KEY_SECRET)[0].symbolize_keys
      begin
        user = User.find(payload[:id])
        self.encode_token({
          id: user.id,
          is_admin: user.account == 'admin'
        }, exp, ACCESS_KEY_SECRET)
      rescue StandardError
        raise 'USER_NOT_FOUND'
      end
    end

    def decode_access_token(token)
      self.decoded_token(token, ACCESS_KEY_SECRET)
    end

    private

    def encode_token(payload, exp = 1.hours.from_now, secret_key)
      raise 'INVALID_INPUT' if payload.blank?
      payload[:exp] = exp.to_i
      JWT.encode(payload, secret_key, 'HS256',HEADER_FIELDS)
    end

    # * Return [payload, header]
    def decoded_token(token, secret_key)
      begin
        JWT.decode(token, secret_key, true, algorithm: 'HS256')
      rescue StandardError
        raise 'INVALID_TOKEN'
      end
    end

  end
end
