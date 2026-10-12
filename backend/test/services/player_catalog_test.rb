require 'test_helper'
require 'minitest/mock'

class PlayerCatalogTest < ActiveSupport::TestCase
  setup do
    @records = [
      { 'playerId' => 'jadan-florida', 'name' => 'Jadan Baugh', 'currentTeam' => { 'name' => 'Florida' } },
      { 'playerId' => 'michael-wv', 'name' => 'Michael Hawkins Jr.', 'currentTeam' => { 'name' => 'West Virginia' } },
      { 'playerId' => 'jaden-texas', 'name' => 'Jaden Smith', 'currentTeam' => { 'name' => 'Texas' } }
    ]
    records = @records
    @collection = Object.new
    @collection.define_singleton_method(:find) { |_filter, projection:| records }
  end

  def search(query, limit: 8)
    PlayerCatalog.stub(:players, @collection) { PlayerCatalog.search(query, limit: limit).map { |player| player['playerId'] } }
  end

  test 'finds normalized names, surnames, partial names and reversed tokens' do
    ['JADAN BAUGH', 'baugh', 'jad bau', 'Baugh, Jadan'].each do |query|
      assert_equal ['jadan-florida'], search(query), query
    end
    assert_equal ['michael-wv'], search('Hawkins Jr.')
  end

  test 'tolerates missing, extra, substituted and transposed letters' do
    ['jdan baugh', 'jaadan baugh', 'jadan bough', 'jadan bauhg'].each do |query|
      assert_equal ['jadan-florida'], search(query), query
    end
  end

  test 'ranks exact matches before fuzzy matches and applies limit after ranking' do
    assert_equal ['jaden-texas', 'jadan-florida'], search('jaden')
    assert_equal ['jaden-texas'], search('jaden', limit: 1)
  end

  test 'searches school names without requiring normalized fields' do
    assert_equal ['michael-wv'], search('west virginia')
    assert_equal ['jadan-florida'], search('flordia')
  end

  test 'ranks exact school matches before loosely similar player names' do
    @records << { 'playerId' => 'aiden-texas', 'name' => 'Aiden Flora', 'currentTeam' => { 'name' => 'Texas' } }
    assert_equal 'jadan-florida', search('florida').first
  end

  test 'returns no matches for unrelated queries or unmatched extra tokens' do
    assert_empty search('zzzzzzzz')
    assert_empty search('jadan zzzzzzzz')
  end

  test 'blank and punctuation queries do not read MongoDB' do
    PlayerCatalog.stub(:players, -> { flunk 'Blank queries must not hit MongoDB' }) do
      [nil, '', '   ', '.*'].each { |query| assert_empty PlayerCatalog.search(query) }
    end
  end

  test 'database failures propagate instead of masquerading as empty results' do
    PlayerCatalog.stub(:players, -> { raise Mongo::Error, 'unreachable' }) do
      assert_raises(Mongo::Error) { PlayerCatalog.search('jadan') }
    end
  end
end
