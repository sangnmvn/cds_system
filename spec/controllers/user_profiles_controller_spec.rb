require "rails_helper"

RSpec.describe UsersController, type: :controller do
  def login(user)
    post user_session_path, user: user
  end
  before (:each) do
    user = User.create(id: 1, first_name: "admin", last_name: "admin", email: "email@example.com", password: "password")
    login(user)
  end

  describe "users#user_profile" do
    it "users#user_profile when valid" do
      get :user_profile
      expect(response.status).to eq(302)
    end
    it "should render users#user_profile template" do
      visit user_profile_users_path
      expect(page).to have_content(@user.email)
      #expect(assigns(:users)).to match_array(["admin"])
      #expect(response).to render_template("user_profile")
    end
  end
  describe "users#edit_user_profile" do
    it "should render users#edit_user_profile template" do
      visit user_profile_users_path
      fill_in('first_name', with: 'John')
      expect{
        post :edit_user_profile
      }.to change(User,:count).by(0)
    end
  end
end
