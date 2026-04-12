# Local Database Setup

Postgres runs in a Docker container named `mal-clone-db`. The container must publish port `5432` so the Express app (running on the host) can connect.

## One-time container setup

```bash
docker run -d \
  --name mal-clone-db \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  postgres
```

## Initialize the database

```bash
npm run db:setup
```

This runs two steps:

1. `npm run db:init` — pipes `db/init.sql` into the container as the `postgres` superuser, creating the `mal_user` role and `mal_clone` database.
2. `npm run db:build` — runs `db/build.js` against `mal_clone` to apply `src/schema.sql` (tables).

You can run the steps individually if you only need one.

## .env

```
DATABASE_URL=postgres://mal_user:mal_password@localhost:5432/mal_clone
JWT_SECRET=some_long_random_string_here
```

## Notes

- `src/schema.sql` contains tables only. It is loaded by `db/build.js` in prod and by PGlite in tests, so it must stay free of `CREATE USER` / `CREATE DATABASE` statements.
- `db/init.sql` holds the one-time cluster setup (role + database) and is only run via `npm run db:init`.
