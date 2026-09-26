Rails.application.routes.draw do
  get 'greetings/hello'
  get 'api/players', to: 'players#index'
  get 'api/players/:id', to: 'players#show'
  # For details on the DSL available within Rails applications, see http://guides.rubyonrails.org/routing.html
end

