require "rails_helper"

RSpec.describe UsersController, type: :controller do
  def login(user)
    post user_session_path, user: user
  end
  before (:each) do
    user = User.create(id: 1, first_name: "admin", last_name: "admin", email: "email@example.com", password: "password")
    login(user)
  end
end
