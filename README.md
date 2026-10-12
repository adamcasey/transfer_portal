# Transfer Portal

The intended product is a college football roster and transfer tracker for FBS
(formerly Division I-A) programs. The repository currently provides a React /
TypeScript frontend, a Rails JSON API, MongoDB player search, PostgreSQL, and a
Redis cache. Full roster coverage and transfer tracking are not implemented.

## Run locally

```sh
docker compose up -d --build
docker compose exec backend bundle exec rails db:prepare
```

Frontend: http://localhost:3000. API: http://localhost:3001/greetings/hello.
Ruby is pinned to 4.0.7; the frontend image uses Node 18. PostgreSQL data stays in
`tmp/db`; do not delete that directory to troubleshoot startup.

## Player search

Set `MONGODB_URI` and `MONGODB_DATABASE` in `backend/.env` (see
`backend/.env.example`). Player search reads the `players` collection from that
database. `GET /api/players?q=jadan%20bauhg&limit=4` supports player or school names,
partial names, reordered name tokens, and typos. Exact matches rank ahead of fuzzy
matches. MongoDB failures return HTTP 503 and the UI shows an error; empty results
show an empty state. Search results never fall back to demo profiles.

The frontend development server proxies `/api` to Rails. Compose sets
`API_PROXY_TARGET=http://backend:3000`; running the frontend on the host defaults
to `http://127.0.0.1:3001`. After changing proxy settings, recreate the frontend:

```sh
docker compose up -d --no-build --no-deps --force-recreate frontend
```

Fuzzy ranking currently reads the imported catalog and uses Ruby's standard
edit-distance implementation. Profiles always show the verified current school;
opening an ESPN-linked profile also loads ESPN bio details and recent headlines.
ESPN athlete news is a public, undocumented endpoint and may change without notice.
Draft projections and NIL deal reports need a licensed source; the profile explains
when one is not connected. The popular-player buttons and program cards still use
demo profiles.
Static production hosting must also route `/api` to the Rails backend; the
development proxy is not part of the production bundle.

For the host-based `dev.sh` launcher, install backend gems and frontend packages
first, then prepare the database with the same `DATABASE_URL` used by the launcher.
Use either the host launcher or the containerized application to avoid port conflicts.

Compose is a local development configuration: PostgreSQL uses trust authentication
and Redis has no password. Both ports bind only to localhost. Production requires
an authenticated `DATABASE_URL`, an authenticated/private `REDIS_URL`, and the
appropriate `ALLOWED_ORIGINS`. Production HTTPS enforcement remains enabled.

## Caching

Development and production use Rails' `redis_cache_store`, configured in
`backend/config/application.rb`. Keys are separated by environment and expire after
five minutes. Tests use `null_store` for isolation. Compose caps Redis at 128 MB,
evicts least-recently-used keys when full, and disables persistence because cache
entries are disposable. The existing local Redis dump is preserved and ignored.

Configuring Redis does **not** automatically cache Active Record queries. MongoDB
holds the imported players; ESPN bio and headline lookups are cached for 30 minutes.
Rails' Redis store falls back to computing the value if Redis is unavailable; the
smoke check below detects that failure.

## Why 2026 rosters are missing

The NCAA importer loads an individual-statistics category rather than complete team
rosters. `espn:import` syncs active FBS team rosters and player images, but does not
provide player school histories, public draft projections, or NIL deals:

- `backend/db/schema.rb` has no team, player, roster, or transfer tables.
- There are no database migrations or domain models beyond `ApplicationRecord`.
- `backend/db/seeds.rb` contains only generated comments.
- `NcaaImporter` writes NCAA player statistics; `EspnImporter` fills active rosters and ESPN athlete IDs.
- Run `docker compose exec backend bundle exec rails espn:import` to sync ESPN rosters.
- ESPN athlete IDs unlock the bio and headlines shown when a profile opens.

At inspection, no Compose services for this project were running and there was no
local database data directory. Starting PostgreSQL created a fresh server; running
`db:prepare` creates the application databases but cannot invent roster data.
The old PDF/BullMQ scripts read an unrelated applicant CSV; Sidekiq had no actual
jobs. Neither was a football ingestion pipeline.

School history beyond the current roster, draft outlooks, and NIL reporting require
additional sources. Do not present modeled estimates or unverified NIL claims as
confirmed deals.

## Checks

```sh
docker compose exec -e RAILS_ENV=test backend bundle exec rails db:prepare test
docker compose exec backend bundle exec rails runner script/check_cache.rb
npm --prefix frontend ci
npm --prefix frontend run typecheck
npm --prefix frontend test -- --runInBand
npm --prefix frontend run build
```

The Redis check verifies the configured Rails cache, a miss followed by a hit,
a server-side expiry, and explicit invalidation without clearing other keys.

## Removed

Unrelated CSV-to-PDF workers and their dependencies; unused Sidekiq/scheduler and
queue dashboard; Spring service and binstubs; Yaichi routing proxy; unused Rails
mail, upload, websocket, server-rendered view, and asset scaffolding; unused browser
test dependencies; and the empty root npm lockfile. The app retains the existing
Rails framework dependency rather than introducing a framework upgrade.
