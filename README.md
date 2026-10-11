# Transfer Portal

The intended product is a college football roster and transfer tracker for FBS
(formerly Division I-A) programs. The repository currently provides a React /
TypeScript frontend, a Rails JSON API, PostgreSQL, and a Redis cache. The only API
endpoint is `GET /greetings/hello`; roster and transfer features are not implemented.

## Run locally

```sh
docker compose up -d --build
docker compose exec backend bundle exec rails db:prepare
```

Frontend: http://localhost:3000. API: http://localhost:3001/greetings/hello.
Ruby is pinned to 4.0.7; the frontend image uses Node 18. PostgreSQL data stays in
`tmp/db`; do not delete that directory to troubleshoot startup.

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

Configuring Redis does **not** automatically cache Active Record queries. There are
currently no roster queries to accelerate. When the roster endpoint is implemented,
cache its serialized query results with `Rails.cache.fetch`, including season,
team, and every filter in the key, and invalidate affected keys after imports.
PostgreSQL remains the source of truth. Rails' Redis store falls back to computing
the value if Redis is unavailable; the smoke check below detects that failure.

## Why 2026 rosters are missing

The repository has no roster-loading implementation:

- `backend/db/schema.rb` has no team, player, roster, or transfer tables.
- There are no database migrations or domain models beyond `ApplicationRecord`.
- `backend/db/seeds.rb` contains only generated comments.
- There is no roster provider/client, source configuration, import task, or refresh schedule.
- The frontend does not query rosters. Its empty state now states that the importer is missing.

At inspection, no Compose services for this project were running and there was no
local database data directory. Starting PostgreSQL created a fresh server; running
`db:prepare` creates the application databases but cannot invent roster data.
The old PDF/BullMQ scripts read an unrelated applicant CSV; Sidekiq had no actual
jobs. Neither was a football ingestion pipeline.

The minimum next implementation needs a chosen roster source with verified 2026
FBS coverage, season-aware team/player/roster tables, and a repeatable import that
validates source responses, upserts records, reports coverage/failures, and updates
the cache. A refresh schedule can call that import once it exists. Nothing in this
cleanup downloads or claims to verify current 2026 rosters.

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
