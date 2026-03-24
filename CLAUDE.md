# Project Context for Claude

## Teaching Context

- This project is used in a **tutored learning session**
- A **human mentor** is present in the conversation and may speak directly to Claude
- Claude is in **teaching mode**: guide the student with questions and hints, never write code for them
- The student switches between **2 machines** — this file is the source of truth for session continuity

## Project: Anime Showcase & Search

### Goal

Build a 3-page anime app served by Express using static HTML/JS/CSS files.
Data source: [Jikan API](https://docs.api.jikan.moe/) (free, no auth required).

### Pages

| Route      | File                       | Purpose                                        |
| ---------- | -------------------------- | ---------------------------------------------- |
| `/`        | `public/index.html`        | Top anime (home page)                          |
| `/search/` | `public/search/index.html` | Search anime by name                           |
| `/detail/` | `public/detail/index.html` | Anime detail view (via query param or similar) |

### File Structure (target)

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
  router.js         ← API routes (e.g. /trains — legacy, may be repurposed)
  controllers/
    trains.js       ← legacy controller stub
```

### Tech Constraints (by mentor decision)

- **No async/await** — use `.then()` / `.catch()` Promise chains only
- **No frontend framework** — vanilla HTML, CSS, JS
- **No build tools** — files served directly as static assets
- **Proxy pattern**: frontend fetches from own Express server, Express fetches from Jikan API
  - Frontend calls e.g. `/api/top-anime`, `/api/search?q=...`, `/api/anime/:id`
  - Express routes/controllers fetch from Jikan and return the data
  - Student learned this pattern in week-3

### Current State (as of 2026-03-21)

- `src/app.js` already has `express.static` pointed at `public/`
- `public/index.html` updated — now shows "Top Anime" with `<div id="container"></div>` and links to `./app.js`
- `public/app.js` is the active JS file (old `script.js` code is commented out)
- Branch: `feat/get-train-schedule` (frontend work is happening here)

### Jikan API Endpoints to Use

- Top anime: `GET https://api.jikan.moe/v4/top/anime`
- Search: `GET https://api.jikan.moe/v4/anime?q={query}`
- Anime detail: `GET https://api.jikan.moe/v4/anime/{id}`

### Jikan Response Structure

- Top-level keys: `pagination`, `data`
- Anime array is at `response.data` (array of objects)
- Each anime has: `title`, `score`, `mal_id`, `images.jpg.image_url`

### Student Progress

- [x] Replace `public/index.html` with Top Anime page structure
- [x] Fetch top anime via Express proxy (`/api/top-anime`)
- [x] Render 10 anime cards with image, title, and score using `createElement` + `appendChild`
- [x] Cards clickable — navigate to `/detail/?id={mal_id}`
- [x] Build search page — input, button, event listener, fetch on submit, clear old results
- [x] Proxy pattern on all pages — frontend never calls Jikan directly
- [x] Detail page — reads `id` from URL, fetches `/api/anime-details/:id`, renders title, image, score, synopsis, episodes, type
- [x] Basic supertest test passing (`search with valid query returns 200`)
- [x] Error handling with `.catch()` on all 3 controllers
- [x] kebab-case routes (`/api/top-anime`, `/api/search`, `/api/anime-details/:id`)
- [x] `cursor: pointer` on card hover for home and search pages
- [x] URL encoding with `encodeURIComponent` on search and detail pages
- [ ] Add pagination to search page
- [ ] Learn and apply caching on Express routes (e.g. cache Jikan responses to avoid rate limiting)
- [ ] Split render logic from fetch logic (separate functions) on all pages
- [x] Finish mocked test using `search-one-piece.json` stub
- [x] Add body assertions to tests (status code, content type, body shape)
- [ ] Add unhappy path tests (rate limit simulation, invalid ID)
- [x] Write proper README (user persona, user stories, problem statement)
- [ ] Style all 3 pages with CSS

### Student Understanding Checkpoints

- Knows script tag goes at bottom of body (DOM must exist before JS runs)
- Knows `+=` vs `=` for innerHTML (preserves previous cards)
- Knows `.then()` chain — semicolon between chains breaks them
- Knows Jikan data lives at `data.data`, not at root
- Knows `createElement` + `appendChild` pattern for safe DOM manipulation
- Knows proxy pattern — frontend never calls external API directly
- Understands why mocking fetch matters (flaky tests, rate limits)
- Struggles with nested bracket/parenthesis structure in tests — needs more practice

### Test File State (`src/tests/search.test.js`)

- Import: `import searchStub from "./stubs/search-one-piece.json" with { type: "json" }`
- Stub file: `src/tests/stubs/search-one-piece.json` (real Jikan response shape)
- Mock pattern: `vi.stubGlobal("fetch", () => Promise.resolve({ json: () => Promise.resolve(searchStub) }))`
- Student was mid-way fixing bracket structure when session ended

---

## Mentor Notes (direct instructions from human mentor)

1. **Tech stack decision** — No async/await. Use `.then()` chains only. Serve 3 sets of static assets (HTML/JS/CSS) from Express. Apex `/` serves the Top Anime home page.

2. **File structure** — `public/index.html` is the home/top page. Search and detail live in `public/search/` and `public/detail/` subfolders.

3. **Proxy pattern** — Frontend must NOT call Jikan directly. All API calls go through the student's own Express server (learned in week-3). Express fetches from Jikan and returns the data.

4. **Testing direction** — Use supertest for automated server tests. Follow up with useful edge case tests (empty query, no results, double click).

5. **Test quality standards**:
   - Test names must describe **user behavior**, not implementation (e.g. `"search with valid query returns results"`)
   - Each test should validate: status code, response content, content type
   - Tests must be **re-runnable** and **free from external API calls** (mock fetch, use stubs)
   - Cover both **happy and unhappy paths**
   - Consider: what if Jikan is rate-limited? Tests must not depend on external availability

6. **Stub files** — Real Jikan response stubs stored in `src/tests/stubs/`. Use `search-one-piece.json` for search tests. Import with `{ type: "json" }` assertion.

7. **Home page proxy** — Top anime home page (`public/app.js`) must also go through Express proxy, not call Jikan directly.

8. **PR Review comments (from Amoodaa on PR #4)**:
   - `public/search/app.js` — Add `cursor: pointer` on hover to indicate cards are clickable
   - `src/controllers/top-anime.js` — Add graceful error handling (`.catch()`)
   - `src/controllers/anime-search.js` — Add graceful error handling (`.catch()`)
   - `src/controllers/anime-details.js` — Add graceful error handling (`.catch()`)
   - `src/tests/search.test.js` — Remove commented-out tests; add more expectations that assess the response body
   - `src/app.js` — Look into URL encoding (`encodeURIComponent`) and handle it gracefully on search and detail pages
   - `src/router.js` — Use kebab-case for URL paths (e.g. `/api/top-anime` not `/api/top-anime`); read about RESTful API naming conventions
   - `README.md` — Delete current content and write a proper README with user persona, user stories, and problem statement

9. **Detail page** — Must accept an `animeId` from the URL query param (e.g. `/detail/?id=21`). Fetches anime detail via Express proxy using that ID.

10. **Navigation** — Cards on both home page and search results must be clickable and navigate to `/detail/?id={mal_id}`.
