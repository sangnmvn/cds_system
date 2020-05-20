namespace :reminder do
  desc "Test rake task"
  task send_mail: :environment do
    puts "this test send mail"
  end
end