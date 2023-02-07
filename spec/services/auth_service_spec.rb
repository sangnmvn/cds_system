require "rails_helper"
RSpec.describe Api::AuthService, type: :request do
  let(:past_time) {Time.now - 1.day}
  let(:future_time) { Time.now + 1.year}
  let!(:auth_service) {Api::AuthService.new}
  let!(:payload) { {id:1, is_admin: true} }

  describe "#encode" do

    # * token is diffence from payload
    # * token include dot

    it "payload null " do
      expect { auth_service.encode_token(nil,past_time) }.to raise_error("INVALID_INPUT")
    end

    it "payload hash with past time " do
        token = auth_service.encode_token(payload, past_time)
        expect(token).not_to eq(payload)
        expect(token).to include('.')
    end

    it "payload hash with future time" do
      token = auth_service.encode_token(payload, future_time)
      expect(token).not_to eq(payload)
      expect(token).to include('.')
    end
  end

  let(:token_valid) {auth_service.encode_token(payload, future_time)}
  let(:token_expired) {auth_service.encode_token(payload, past_time)}
  let(:token_invalid) {'ey.sad.sa'}
  describe "#decode" do

    it "token valid?" do
      payload_i = auth_service.decoded_token(token_valid)[0].symbolize_keys
      expect(payload_i).to eq(payload)
    end
    it "token expired? return error" do
      expect {auth_service.decoded_token(token_expired)}.to raise_error("INVALID_TOKEN")
    end
    it "token invalid? return error" do
      expect {auth_service.decoded_token(token_invalid)}.to raise_error("INVALID_TOKEN")
    end
    it "token in deny list" do
      JwtDenyList.create!({
        jwt: token_valid,
        exp: future_time
      })
      expect {auth_service.decoded_token(token_valid)}.to raise_error("INVALID_TOKEN")
      jwt_deny = JwtDenyList.find_by(jwt: token_valid)
      jwt_deny.delete if jwt_deny.present?
    end
  end

  describe "#add_deny_list" do
    it "add valid token => save to database" do
      auth_service.add_deny_list(token_valid)
      jwt_deny = JwtDenyList.find_by(jwt: token_valid)
      expect(jwt_deny).not_to eq(nil)
      jwt_deny.delete if jwt_deny.present?
    end

    it "add invalid token => not save to database" do
      auth_service.add_deny_list(token_invalid)
      jwt_deny = JwtDenyList.find_by(jwt: token_invalid)
      expect(jwt_deny).to eq(nil)
    end
  end

  describe "#valid_or_generate_token" do
    it "valid token show return this token" do
      token = auth_service.valid_or_generate_token(token_valid, User.first)
      expect(token).to eq(token_valid)
    end

    it "expired token should return new token" do
      token = auth_service.valid_or_generate_token(token_expired,User.first)
      expect(token).not_to eq(token_expired)
    end

    it "null should return new token" do
      token = auth_service.valid_or_generate_token(nil,User.first)
      expect(token).not_to eq(token_expired)
    end
  end
end
