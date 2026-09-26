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

    escaped = Regexp.escape(normalized)
    players.find({ '$or' => [
      { 'nameNormalized' => { '$regex' => "^#{escaped}" } },
      { 'searchTokens' => { '$regex' => "^#{escaped}" } },
      { 'currentTeam.nameNormalized' => { '$regex' => "^#{escaped}" } }
    ] }).sort({ 'nameNormalized' => 1 }).limit(limit).to_a.map { |player| compact(player) }
  rescue Mongo::Error => e
    Rails.logger.error("[PlayerCatalog] search failed: #{e.message}")
    []
  end

  def self.find(id)
    player = players.find({ 'playerId' => id.to_s }).first
    player && player.except('_id')
  end

  def self.compact(player)
    player.slice('playerId', 'name', 'position', 'classYear', 'currentTeam', 'image', 'initials')
  end
end
