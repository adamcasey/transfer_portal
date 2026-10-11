Rails.application.routes.draw do
  get 'greetings/hello'
  get 'api/players', to: 'players#index'
  get 'api/players/:id', to: 'players#show'
end
