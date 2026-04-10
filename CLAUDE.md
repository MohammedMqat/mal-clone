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
  controllers/
    top-anime.js
    anime-search.js
    anime-details.js
  tests/
    search.test.js
    stubs/
      search-one-piece.json
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
- Stubs in `src/tests/stubs/` (real Jikan response shapes)
- Mock pattern: `vi.stubGlobal("fetch", () => Promise.resolve({ json: () => Promise.resolve(stub) }))`
- Import stubs: `import stub from "./stubs/search-one-piece.json" with { type: "json" }`
- Test names describe user behavior, not implementation
- Each test validates: status code, content type, response body shape
- No external API calls in tests — always mock fetch

## Remaining Work

- [ ] Caching on Express routes (avoid Jikan rate limits)
- [ ] Unhappy path tests (rate limit simulation, invalid ID)
- [ ] CSS styling for all 3 pages
