require "rails_helper"
RSpec.describe UserDevise::AuthController, type: :request do

  let!(:auth_service) {Api::AuthService.new}
  let(:refresh_token) do
    auth_service.generate_refresh_token({
      id: User.first.id
    }, 2.weeks.from_now)
  end
  let(:invalid_refresh) do
    auth_service.generate_refresh_token({
      id: User.first.id
    }, DateTime.now - 2.weeks)
  end

  describe "/users/verify" do
    it "valid token" do
      access_token = auth_service.refresh_access_token(refresh_token)
      get "/users/verify?token=#{access_token}"
      parsed_body = JSON.parse(response.body)

      expect(response).to have_http_status(200)
      expect(parsed_body["id"]).to eq(User.first.id)
    end

    it "invalid token" do
      access_token = auth_service.refresh_access_token(refresh_token, DateTime.now - 2.weeks)
      get "/users/verify?token=#{access_token}"
      parsed_body = JSON.parse(response.body)

      expect(response).not_to have_http_status(200)
      expect(parsed_body["error"]).to eq("INVALID_TOKEN")
    end

    it "use refresh_token token" do
      get "/users/verify?token=#{refresh_token}"
      parsed_body = JSON.parse(response.body)

      expect(response).not_to have_http_status(200)
      expect(parsed_body["error"]).to eq("INVALID_TOKEN")
    end
  end

  describe "/users/refresh" do
    it "valid token" do
      post "/users/refresh", :params => { "token": refresh_token }.to_json,
           :headers => {'CONTENT_TYPE': 'application/json'}
      parsed_body = JSON.parse(response.body)
      payload = auth_service.decode_access_token(parsed_body['access_token'])[0]

      expect(response).to have_http_status(200)
      expect(payload["id"]).to eq(User.first.id)
    end

    it "invalid token" do
      post "/users/refresh", :params => { "token": invalid_refresh }.to_json,
           :headers => {'CONTENT_TYPE': 'application/json'}
      parsed_body = JSON.parse(response.body)

      expect(response).not_to have_http_status(200)
      expect(parsed_body["error"]).to eq("INVALID_TOKEN")
    end
  end




end
