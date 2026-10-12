require 'did_you_mean'

class PlayerCatalog
  COLLECTION = 'players'

  def self.client
    @client ||= Mongo::Client.new(ENV.fetch('MONGODB_URI'), database: ENV.fetch('MONGODB_DATABASE', 'transfer_portal'))
  end

  def self.players
    client[COLLECTION]
  end

  def self.search(query, limit: 8)
    normalized = normalize(query)
    return [] if normalized.empty?

    tokens = normalized.split
    # shortcut: rank the small imported catalog in Ruby; use indexed MongoDB Search when importing full rosters.
    players.find({}, projection: { _id: 0, playerId: 1, espnId: 1, name: 1, position: 1, classYear: 1, currentTeam: 1, image: 1, initials: 1, jersey: 1, schools: 1, draft: 1, nil: 1, news: 1 })
      .filter_map do |player|
        name = normalize(player['name'])
        name_score = match_score(name, tokens)
        team_score = match_score(normalize(player.dig('currentTeam', 'name')), tokens)
        next if name_score.nil? && team_score.nil?

        score = name == normalized ? -1 : [name_score && name_score * 2, team_score && team_score * 2 + 1].compact.min
        [score, name, compact(player)]
      end.sort_by { |score, name, _player| [score, name] }.first(limit).map(&:last)
  end

  def self.find(id)
    player = players.find({ 'playerId' => id.to_s }).first
    player && player.except('_id')
  end

  def self.compact(player)
    player.slice('playerId', 'espnId', 'name', 'position', 'classYear', 'currentTeam', 'image', 'initials', 'jersey', 'schools', 'draft', 'nil', 'news')
  end

  def self.normalize(value)
    value.to_s.downcase.gsub(/[^a-z0-9 ]/, ' ').split.join(' ')
  end

  def self.match_score(value, tokens)
    words = value.split
    scores = tokens.map do |token|
      words.filter_map do |word|
        next 0 if word == token
        next 1 if word.start_with?(token)
        next 2 if word.include?(token)
        next if token.length < 4

        distance = DidYouMean::Levenshtein.distance(token, word)
        3 + distance if distance <= (token.length >= 5 ? 2 : 1)
      end.min
    end
    scores.sum unless scores.any?(&:nil?)
  end
end
