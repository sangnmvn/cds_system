source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

#sudo apt-get install libreoffice
ruby "2.7.1"
gem "ajax-datatables-rails"
gem "zip-zip"
gem "rubyzip"
gem "axlsx", "~> 1.3.4"
gem "axlsx_rails" # Provide templates for the axlsx gem
gem "libreconv"
gem "nokogiri"
gem "carrierwave", "~> 0.10.0"
gem "rails-controller-testing"
gem "async-await", "~> 0.0.0"
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 6.0.2", ">= 6.0.2.2"
# Use mysql as the database for Active Record
gem "mysql2", ">= 0.4.4"
# Use Puma as the app server
gem "puma", "~> 4.1"
# Use SCSS for stylesheets
gem "sass-rails", ">= 6"
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem "webpacker", "~> 4.0"
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem "turbolinks", "~> 5"
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.7"

gem "config"

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
gem "bootstrap", "~> 4.4.1"
gem "gretel", "~> 3.0", ">= 3.0.9"
gem "jquery-rails"

gem "popper_js", "~> 1.14.5"
gem "select_all-rails"
gem "font-awesome-sass"
gem "bootstrap-datepicker-rails"
gem "whenever", require: false
# Use Active Storage variant
# gem 'image_processing', '~> 1.2'
gem "kaminari"
# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.2", require: false

##### Additional gems##############
# gem "activeadmin"
gem "devise"
gem "cancancan"
gem "pry"
gem "chartkick"
gem "ransack", "~> 2.3.0"

# gem "activeadmin_addons"
# gem "bootstrap-sass"
###################################
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "rspec-rails", "~> 3.4"
  gem "simplecov", "~> 0.18.5"
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem "web-console", ">= 3.3.0"
  gem "listen", ">= 3.0.5", "< 3.2"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

group :test do
  gem "shoulda-matchers", "~> 4.0", require: false
  gem "database_cleaner", "~> 1.5"
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", ">= 2.15"
  gem "selenium-webdriver"
  # Easy installation and use of web drivers to run system tests with browsers
  gem "webdrivers"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'jwt', '~> 2.5'
# gem 'rufus-scheduler', '~> 3.7'
