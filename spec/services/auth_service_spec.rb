require "rails_helper"
RSpec.describe Api::AuthService, type: :request do
  let(:past_time) {Time.now - 1.day}
  let(:future_time) { Time.now + 1.year}
  let!(:auth_service) {Api::AuthService.new}
  let!(:payload) { {id:1, is_admin: true} }

  describe "#refresh_access_token" do

    it "refresh invalid token" do
      refresh_token = auth_service.generate_refresh_token({
        id: User.first.id
      }, past_time)

      expect {auth_service.refresh_access_token(refresh_token)}.to raise_error("INVALID_TOKEN")
    end

    it "refresh valid token" do
      refresh_token = auth_service.generate_refresh_token({
        id: User.first.id
      }, future_time)
      access_token = auth_service.refresh_access_token(refresh_token)

      expect(access_token).not_to eq(refresh_token)
      expect(access_token).to include('.')
    end
  end

  describe "#decode_access_token" do
    it "invalid access token" do
      refresh_token = auth_service.generate_refresh_token({
        id: User.first.id
      }, future_time)
      access_token = auth_service.refresh_access_token(refresh_token, past_time)


      expect {auth_service.decode_access_token(access_token)}.to raise_error("INVALID_TOKEN")

    end

    it "valid access token" do
      refresh_token = auth_service.generate_refresh_token({
        id: User.first.id
      }, future_time)
      access_token = auth_service.refresh_access_token(refresh_token, future_time)


      payload = auth_service.decode_access_token(access_token)[0]
      expect(payload["id"]).to eq(User.first.id)

    end

  end

end
