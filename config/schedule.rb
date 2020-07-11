# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron
require File.expand_path(File.dirname(__FILE__) + "/../config/environment")
# Example:
#
# set :output, "/path/to/my/cron_log.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
# every 4.days do
#   runner "AnotherModel.prune_old_records"
# end

# Learn more: http://github.com/javan/whenever
# whenever --update-crontab
# to update task (run scheduled task)
every 1.day, at: "0:00 am" do
  runner "Schedule.update_status", :environment => Rails.env, :output => "log/cron.log"
  runner "Schedule.deliver_reminder", :environment => Rails.env, :output => "log/cron.log"
end

every 15.minutes do
  runner "Api::ExportService.new({}, User.find(1)).clean_up_public_folder", :environment => Rails.env, :output => "log/cron.log"
end
