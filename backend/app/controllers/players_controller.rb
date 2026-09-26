class PlayersController < ApplicationController
  def index
    render json: { players: PlayerCatalog.search(params[:q], limit: [params.fetch(:limit, 8).to_i, 20].min) }
  end

  def show
    player = PlayerCatalog.find(params[:id])
    return render json: { error: 'Player not found' }, status: :not_found unless player

    render json: player
  end
end
