require 'net/http'
require 'json'
require 'uri'

class NcaaImporter
  API_ROOT = 'https://ncaa-api.henrygd.me'
  SOURCE = 'henrygd/ncaa-api'

  def initialize(dry_run: false, season: 'current')
    @dry_run = dry_run
    @season = season
    @players = Mongo::Client.new(ENV.fetch('MONGODB_URI'), database: ENV.fetch('MONGODB_DATABASE', 'transfer_portal'))['players']
    @players.indexes.create_one({ 'playerId' => 1 }, unique: true, name: 'players_player_id_unique') unless @dry_run
    @players.indexes.create_one({ 'nameNormalized' => 1 }, name: 'players_name_normalized') unless @dry_run
  end

  def run
    payload = get('/stats/football/fbs/current/individual/750')
    rows = Array(payload['data'] || payload['players'] || payload['results'])
    rows.each { |row| upsert_player(row) }
    { source: SOURCE, season: @season, status: 'completed', players: rows.length, dryRun: @dry_run }
  rescue StandardError => e
    { source: SOURCE, season: @season, status: 'failed', error: e.message, dryRun: @dry_run }
  end

  private

  def get(path)
    uri = URI.join(API_ROOT, path)
    response = Net::HTTP.get_response(uri)
    raise "NCAA API #{response.code}: #{path}" unless response.is_a?(Net::HTTPSuccess)
    JSON.parse(response.body)
  end

  def upsert_player(row)
    name = row['name'] || row['playerName'] || row.dig('player', 'name')
    return if name.to_s.empty?

    player_id = (row['playerId'] || row['id'] || row.dig('player', 'id')).to_s
    normalized = name.downcase.gsub(/[^a-z0-9 ]/, ' ').split.join(' ')
    document = {
      'playerId' => player_id,
      'name' => name,
      'nameNormalized' => normalized,
      'searchTokens' => normalized.split,
      'position' => row['position'],
      'classYear' => row['class'] || row['classYear'],
      'currentTeam' => { 'name' => row['team'] || row.dig('team', 'name'), 'nameNormalized' => (row['team'] || '').to_s.downcase },
      'latestSeason' => @season,
      'source' => SOURCE,
      'updatedAt' => Time.now.utc
    }
    return if @dry_run

    @players.update_one({ 'playerId' => player_id }, { '$set' => document, '$setOnInsert' => { 'createdAt' => Time.now.utc } }, upsert: true)
  end
end
