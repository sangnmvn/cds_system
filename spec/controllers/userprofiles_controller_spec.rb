require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  include Devise::Test::IntegrationHelpers

  describe "GET users#user_profile" do
    it "should render users#user_profile template" do
      user = User.create(first_name: "admin", last_name: "admin", email: "email@example.com", password: "123")
      sign_in user
      get user_profile
  
      page.should have_content(user)
    end
  end
  describe "POST users#edit_user_profile" do
    it "should render users#edit_user_profile template" do
      user = User.create(first_name: "admin", last_name: "admin", email: "email@example.com", password: "123")
      sign_in user
      visit edit_user_profile_users_path(user.id)
      
      fill_in "first_name", with: "Admin"
      fill_in "last_name", with: "Ahihi"

      expect { click_button "btn_save_contact" }.to change(User, :count).by(1)
    end
  end
end