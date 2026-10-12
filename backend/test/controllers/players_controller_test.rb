require 'test_helper'
require 'minitest/mock'

class PlayersControllerTest < ActionDispatch::IntegrationTest
  test 'returns catalog results and forwards query and bounded limit' do
    search = ->(query, limit:) do
      assert_equal 'jadan bauhg', query
      assert_equal 20, limit
      [{ 'playerId' => 'jadan-florida', 'name' => 'Jadan Baugh' }]
    end
    PlayerCatalog.stub(:search, search) { get '/api/players', params: { q: 'jadan bauhg', limit: 100 } }
    assert_response :success
    assert_equal 'jadan-florida', response.parsed_body['players'].first['playerId']
  end

  test 'nonpositive limits cannot request an unlimited MongoDB result' do
    PlayerCatalog.stub(:search, ->(_query, limit:) { assert_equal 1, limit; [] }) do
      get '/api/players', params: { q: 'jadan', limit: 0 }
    end
    assert_response :success
  end

  test 'rejects oversized searches before accessing the catalog' do
    PlayerCatalog.stub(:search, ->(*) { flunk 'Oversized query reached catalog' }) do
      get '/api/players', params: { q: 'a' * 101 }
    end
    assert_response :bad_request
  end

  test 'reports MongoDB and configuration failures as unavailable' do
    [Mongo::Error, KeyError].each do |error|
      PlayerCatalog.stub(:search, ->(*) { raise error, 'private connection detail' }) do
        get '/api/players', params: { q: 'jadan' }
      end
      assert_response :service_unavailable
      assert_equal({ 'error' => 'Player search unavailable. Please try again.' }, response.parsed_body)
    end
  end
end
