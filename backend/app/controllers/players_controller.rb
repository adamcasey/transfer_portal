class PlayersController < ApplicationController
  rescue_from Mongo::Error, KeyError do |error|
    Rails.logger.error("[PlayerCatalog] database unavailable: #{error.class}")
    render json: { error: 'Player search unavailable. Please try again.' }, status: :service_unavailable
  end

  def index
    return render json: { error: 'Search must be 100 characters or fewer' }, status: :bad_request if params[:q].to_s.length > 100

    render json: { players: PlayerCatalog.search(params[:q], limit: params.fetch(:limit, 8).to_i.clamp(1, 20)) }
  end

  def show
    player = PlayerCatalog.find(params[:id])
    return render json: { error: 'Player not found' }, status: :not_found unless player

    team = player.dig('currentTeam', 'name')
    player['schools'] = [{ 'name' => team, 'years' => 'Current' }] if Array(player['schools']).empty? && team.present?
    player.merge!(EspnProfile.fetch(player['espnId']))
    render json: player
  end
end
