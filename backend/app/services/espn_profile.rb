require 'net/http'
require 'json'
require 'uri'

class EspnProfile
  API_ROOT = ENV.fetch('ESPN_API_ROOT', 'https://site.api.espn.com/apis/site/v2/sports/football/college-football')

  def self.fetch(id)
    return {} unless id.to_s.match?(/\A\d+\z/)

    Rails.cache.fetch("espn-profile:v1:#{id}", expires_in: 30.minutes) do
      athlete = get("/athletes/#{id}") || {}
      articles = Array(get("/athletes/#{id}/news").to_h.fetch('articles', []))
      {
        'bio' => athlete.slice('displayHeight', 'displayWeight', 'dateOfBirth', 'birthPlace'),
        'news' => articles.first(6).filter_map do |article|
          url = article.dig('links', 'web', 'href')
          next if url.blank? || article['headline'].blank?

          { 'source' => 'ESPN', 'title' => article['headline'], 'date' => article['published'], 'url' => url }
        end
      }
    end
  rescue StandardError => e
    Rails.logger.warn("[EspnProfile] enrichment unavailable: #{e.class}")
    {}
  end

  def self.get(path)
    uri = URI("#{API_ROOT}#{path}")
    request = Net::HTTP::Get.new(uri)
    request['Accept'] = 'application/json'
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 3, read_timeout: 5) { |http| http.request(request) }
    JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)
  end
  private_class_method :get
end
