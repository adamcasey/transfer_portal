class PlayerCatalog
  COLLECTION = 'players'

  def self.client
    @client ||= Mongo::Client.new(ENV.fetch('MONGODB_URI'), database: ENV.fetch('MONGODB_DATABASE', 'transfer_portal'))
  end

  def self.players
    client[COLLECTION]
  end

  def self.search(query, limit: 8)
    normalized = query.to_s.downcase.gsub(/[^a-z0-9 ]/, ' ').split.join(' ')
    return [] if normalized.empty?

    pipeline = [
      { '$search' => {
        'index' => 'players_search',
        'compound' => {
          'should' => [
            { 'autocomplete' => { 'query' => normalized, 'path' => 'name', 'fuzzy' => { 'maxEdits' => 2, 'prefixLength' => 1 } } },
            { 'autocomplete' => { 'query' => normalized, 'path' => 'currentTeam.name', 'fuzzy' => { 'maxEdits' => 1, 'prefixLength' => 1 } } },
            { 'text' => { 'query' => normalized, 'path' => ['position', 'classYear'], 'fuzzy' => { 'maxEdits' => 1 } } }
          ],
          'minimumShouldMatch' => 1
        }
      } },
      { '$limit' => limit },
      { '$project' => { 'playerId' => 1, 'name' => 1, 'position' => 1, 'classYear' => 1, 'currentTeam' => 1, 'image' => 1, 'initials' => 1 } }
    ]
    players.aggregate(pipeline).to_a.map { |player| compact(player) }
  rescue Mongo::Error => e
    Rails.logger.error("[PlayerCatalog] search failed: #{e.message}")
    raise
  end

  def self.find(id)
    player = players.find({ 'playerId' => id.to_s }).first
    player && player.except('_id')
  end

  def self.compact(player)
    player.slice('playerId', 'name', 'position', 'classYear', 'currentTeam', 'image', 'initials')
  end
end
