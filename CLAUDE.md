# Project: Anime Showcase & Search

Express server serving 3 static HTML/JS/CSS pages, proxying data from the [Jikan API](https://docs.api.jikan.moe/).

## Pages & Routes

| Route        | File                       | Purpose           |
| ------------ | -------------------------- | ----------------- |
| `/`          | `public/index.html`        | Top anime home    |
| `/search/`   | `public/search/index.html` | Search by name    |
| `/anime/:id` | `public/detail/index.html` | Anime detail view |

## File Structure

```
public/
  index.html        ← top anime home page
  app.js
  style.css
  search/
    index.html
    app.js
    style.css
  detail/
    index.html
    app.js
    style.css
src/
  app.js            ← Express app, serves public/ via express.static
  server.js         ← starts server on port 9080
  router.js         ← API routes + manual route for /anime/:id
  db.js             ← exports db.sql tagged template (postgres.js in prod, PGlite in test)
  schema.sql        ← database schema (users table)
  controllers/
    top-anime.js
    anime-search.js
    anime-details.js
  tests/
    setup.js        ← global test setup (PGlite per test, schema, seed)
    search.test.js
    db.test.js
    stubs/
      search-one-piece.json
vitest.config.js    ← wires setup.js for all tests
```

## Tech Constraints

- **No async/await** — `.then()` / `.catch()` Promise chains only
- **No frontend framework** — vanilla HTML, CSS, JS
- **No build tools** — files served as static assets

## Architecture

**Proxy pattern**: frontend never calls Jikan directly. All API calls go through the Express server.

| Express route            | Jikan endpoint    |
| ------------------------ | ----------------- |
| `/api/top-anime`         | `GET /v4/top/anime` |
| `/api/search?q=...`      | `GET /v4/anime?q={query}` |
| `/api/anime-details/:id` | `GET /v4/anime/{id}` |

- Routes use kebab-case
- Detail page URL: `/anime/:id` — Express serves `public/detail/index.html` via manual route in `router.js`
- Frontend reads anime ID from `window.location.pathname.split("/")[2]`
- Cards on home and search pages navigate to `/anime/{mal_id}`
- URL encoding via `encodeURIComponent` on search and detail pages

## Jikan API

Base URL: `https://api.jikan.moe/v4`

Response shape:
- Top-level keys: `pagination`, `data`
- Anime array at `response.data`
- Each anime: `title`, `score`, `mal_id`, `images.jpg.image_url`

## Tests

- Framework: Vitest + supertest
- Global setup: `src/tests/setup.js` (configured in `vitest.config.js`)
- Stubs in `src/tests/stubs/` (real Jikan response shapes)
- Test names describe user behavior, not implementation
- Each test validates: status code, content type, response body shape

### Database in tests

- Each test gets a fresh in-memory PostgreSQL via [PGlite](https://pglite.dev/)
- `src/tests/setup.js` handles `beforeEach`/`afterEach`: creates PGlite instance, runs `src/schema.sql`, seeds a test user (`testuser` / `hashed_password_123`), and swaps `db.sql` to a PGlite-backed wrapper
- Controllers use `db.sql` tagged template — same interface in prod (postgres.js) and test (PGlite wrapper)
- **Never mock `db.sql`** — queries run against real SQL in PGlite
- To add tables: update `src/schema.sql`, they'll be created automatically each test

### Mocking external APIs

- **Only mock external HTTP calls** (Jikan API), never database calls
- Mock pattern: `vi.stubGlobal("fetch", () => Promise.resolve({ ok: true, json: () => Promise.resolve(stub) }))`
- Import stubs: `import stub from "./stubs/search-one-piece.json" with { type: "json" }`
- No external API calls in tests — always mock fetch

## Remaining Work

- [ ] Caching on Express routes (avoid Jikan rate limits)
- [ ] Unhappy path tests (rate limit simulation, invalid ID)
- [ ] CSS styling for all 3 pages
