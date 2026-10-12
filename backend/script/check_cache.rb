# Run with: bundle exec rails runner script/check_cache.rb
require 'securerandom'

cache = Rails.cache
raise 'Rails is not using Redis' unless cache.is_a?(ActiveSupport::Cache::RedisCacheStore)

key = "cache-check:#{SecureRandom.uuid}"
begin
  calls = 0
  2.times do
    value = cache.fetch(key) { calls += 1; { 'result' => 42 } }
    raise 'Cached value did not round-trip' unless value == { 'result' => 42 }
  end
  raise 'Cache hit reran the block' unless calls == 1

  redis_key = "#{cache.options.fetch(:namespace)}:#{key}"
  ttl = cache.redis.ttl(redis_key)
  raise "Expected a five-minute Redis TTL, got #{ttl}" unless (1..300).cover?(ttl)

  cache.delete(key)
  raise 'Cache invalidation failed' unless cache.read(key).nil?
  puts 'Redis cache: miss, hit, expiry, and invalidation checks passed.'
ensure
  cache.delete(key)
end
