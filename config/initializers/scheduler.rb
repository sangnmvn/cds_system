require "rufus-scheduler"

scheduler = Rufus::Scheduler.new
scheduler.every "2d" do
  Api::AuthService.new.clear_deny_token_exp
end
