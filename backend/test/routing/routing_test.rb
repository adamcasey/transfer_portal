require 'test_helper'

class RoutingTest < ActionDispatch::IntegrationTest
  test 'API responds with JSON' do
    get '/greetings/hello'
    assert_response :success
    assert_equal({ 'content' => 'Hello from Rails' }, response.parsed_body)
  end
end
