require_relative "boot"

require "rails"
require "active_record/railtie"
require "action_controller/railtie"
require "rails/test_unit/railtie"
require "active_support/core_ext/numeric/time"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Myapp
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.api_only = true
    config.cache_store = :redis_cache_store, {
      url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0'),
      namespace: "transfer_portal:#{Rails.env}",
      expires_in: 5.minutes,
      connect_timeout: 1,
      read_timeout: 1,
      write_timeout: 1
    }

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins ENV.fetch('ALLOWED_ORIGINS', 'http://localhost:3000')
        resource '*', headers: :any, methods: [:get, :post, :options]
      end
    end
  end
end
