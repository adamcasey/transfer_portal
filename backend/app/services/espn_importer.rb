require 'net/http'
require 'json'
require 'uri'

class EspnImporter
  API_ROOT = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football'
  TEAM_API_ROOT = ENV.fetch('ESPN_TEAM_API_ROOT', 'https://site.web.api.espn.com/apis/site/v2/sports/football/college-football')
  SOURCE = 'espn'

  def initialize(dry_run: false)
    @dry_run = dry_run
    @players = Mongo::Client.new(ENV.fetch('MONGODB_URI'), database: ENV.fetch('MONGODB_DATABASE', 'transfer_portal'))['players']
    unless @dry_run
      @players.indexes.create_one({ 'playerId' => 1 }, unique: true, name: 'players_player_id_unique')
      @players.indexes.create_one({ 'nameNormalized' => 1 }, name: 'players_name_normalized')
    end
  end

  def run
    teams = fetch_teams
    total = 0
    teams.each do |team|
      rows = fetch_roster(team['id'])
      rows.each { |p| upsert_player(p, team) }
      total += rows.length
      sleep(0.2)
    end
    { source: SOURCE, status: 'completed', teams: teams.length, players: total, dryRun: @dry_run }
  rescue StandardError => e
    { source: SOURCE, status: 'failed', error: e.message, dryRun: @dry_run }
  end

  private

  def fetch_teams
    payload = get('/teams?groups=80&groupType=conference&enable=groups', root: TEAM_API_ROOT)
    Array(payload.dig('sports', 0, 'leagues', 0, 'groups')).flat_map { |group| group['teams'] || [] }
      .select { |t| t['isActive'] }
  end

  def fetch_roster(team_id)
    payload = get("/teams/#{team_id}/roster")
    payload.fetch('athletes', []).flat_map { |group| group['items'] || [] }
  end

  def upsert_player(player, team)
    name = player['displayName']
    return if name.to_s.strip.empty?

    player_id = "espn-#{player['id']}"
    normalized = name.downcase.gsub(/[^a-z0-9 ]/, ' ').split.join(' ')
    team_name = team['shortDisplayName'] || team['displayName'] || team['name'] || ''
    parts = name.split
    initials = [parts.first&.chr, parts.last&.chr].compact.join.upcase

    document = {
      'playerId'       => player_id,
      'name'           => name,
      'nameNormalized' => normalized,
      'searchTokens'   => normalized.split,
      'position'       => player.dig('position', 'abbreviation') || player.dig('position', 'name'),
      'jersey'         => player['jersey'],
      'classYear'      => player.dig('experience', 'displayValue'),
      'currentTeam'    => { 'name' => team_name, 'nameNormalized' => team_name.downcase },
      'image'          => player.dig('headshot', 'href'),
      'initials'       => initials,
      'espnId'         => player['id'],
      'source'         => SOURCE,
      'updatedAt'      => Time.now.utc
    }
    return if @dry_run

    @players.update_one(
      { '$or' => [{ 'espnId' => player['id'] }, { 'nameNormalized' => normalized, 'currentTeam.nameNormalized' => team_name.downcase }] },
      { '$set' => document.except('playerId'), '$setOnInsert' => { 'playerId' => player_id, 'createdAt' => Time.now.utc } },
      upsert: true
    )
  end

  def get(path, root: API_ROOT)
    uri = URI("#{root}#{path}")
    request = Net::HTTP::Get.new(uri)
    request['User-Agent'] = 'Mozilla/5.0 (compatible; transfer-portal-importer/1.0)'
    request['Accept'] = 'application/json'
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(request) }
    raise "ESPN API #{response.code}: #{path}" unless response.is_a?(Net::HTTPSuccess)
    JSON.parse(response.body)
  end
end
