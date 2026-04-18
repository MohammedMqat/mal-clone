# Student Progress

## Completed

- [x] Replace `public/index.html` with Top Anime page structure
- [x] Fetch top anime via Express proxy (`/api/top-anime`)
- [x] Render 10 anime cards with image, title, and score using `createElement` + `appendChild`
- [x] Cards clickable — navigate to `/anime/{mal_id}` (RESTful, updated from `/detail/?id=`)
- [x] Build search page — input, button, event listener, fetch on submit, clear old results
- [x] Proxy pattern on all pages — frontend never calls Jikan directly
- [x] Detail page — reads `id` from URL, fetches `/api/anime-details/:id`, renders title, image, score, synopsis, episodes, type
- [x] Basic supertest test passing (`search with valid query returns 200`)
- [x] Error handling with `.catch()` on all 3 controllers
- [x] kebab-case routes (`/api/top-anime`, `/api/search`, `/api/anime-details/:id`)
- [x] `cursor: pointer` on card hover for home and search pages
- [x] URL encoding with `encodeURIComponent` on search and detail pages
- [x] Add pagination to search page (Next/Previous buttons, URL reflects q+page, refresh restores results)
- [x] Split render logic from fetch logic (separate functions) on all pages
- [x] Finish mocked test using `search-one-piece.json` stub
- [x] Add body assertions to tests (status code, content type, body shape)
- [x] Write proper README (user persona, user stories, problem statement)
- [x] Rename detail page URL to RESTful format `/anime/:animeId`

## Week 6-7 Progress

- [x] Set up PostgreSQL locally with postgres.js (`src/db.js`)
- [x] Created `src/schema.sql` with `users` table (SERIAL PK, UNIQUE username, password_hash, created_at)
- [x] Built PGlite test infrastructure (`src/tests/setup.js`) — fresh in-memory PG per test, auto-runs schema, seeds testuser
- [x] Wrote `db.test.js` — users table tests (seed check, fresh DB per test, insert, unique constraint rejection)
- [x] Extended `db.test.js` with favorites table tests (insert+retrieve, select by user_id, DELETE with user_id guard so one user can't delete another's favorite)
- [x] Wrote `auth.test.js` — register (empty username 400, short password 400, duplicate 409, valid 201), login (missing password 400, unknown user 401, wrong password 401, valid 200 with set-cookie)
- [x] Wrote `favorites.test.js` — GET/POST/DELETE with 401 for unauthenticated, POST validation (bad entity_type 400, missing entity_id 400), successful save 201, DELETE not-found 404, successful delete 200
- [x] Added caching middleware (`src/middleware/cache.js`)
- [x] Refactored routes to use `:entityType` parameter pattern

### Phase 1 — Complete

- [x] `favorites` table added to `src/schema.sql` (id, user_id FK, entity_id, entity_type CHECK, title)
- [x] `db/build.js` build script created

### Phase 2 — Complete

- [x] Installed `jsonwebtoken`, `cookie-parser`; updated `package.json` scripts with `--env-file=.env`
- [x] Created `.env` with `JWT_SECRET` (gitignored)
- [x] Add `express.json()` + `cookieParser()` to `src/app.js`
- [x] Create `src/controllers/auth.js` (register + login)
- [x] Add auth routes to `src/router.js`
- [x] Create `src/middleware/auth.js` (JWT verify)

### Phase 3 — Complete

- [x] Favorites controller routes (GET, POST, DELETE)
- [x] "Save to favorites" button on detail page
- [x] "My Favorites" page

### Frontend Pages — Complete

- [x] Register page (`/register/`) with client-side validation
- [x] Login page (`/login/`) with error display
- [x] Favorites page (`/favorites/`) with delete support

### Validation — Complete

- [x] Install Zod, create validation schemas for register, login, and favorites (`src/validation.js`)
- [x] In addFavorite controller, fetch Jikan to verify entity_id exists and use real title from API
- [x] Add HTML validation attributes (`required`, `minlength`) on frontend forms
- [x] Updated favorites tests with `vi.stubGlobal("fetch", ...)` mock for Jikan calls

## Understanding Checkpoints

- Knows script tag goes at bottom of body (DOM must exist before JS runs)
- Knows `+=` vs `=` for innerHTML (preserves previous cards)
- Knows `.then()` chain — semicolon between chains breaks them
- Knows Jikan data lives at `data.data`, not at root
- Knows `createElement` + `appendChild` pattern for safe DOM manipulation
- Knows proxy pattern — frontend never calls external API directly
- Understands why mocking fetch matters (flaky tests, rate limits)
- Struggles with nested bracket/parenthesis structure in tests — needs more practice
- Understands URL as source of truth — `URLSearchParams`, `history.pushState`, reading params on load
- Understands `||` fallback pattern for default values
- Understands `document.querySelector` vs `getElementById`
- Understands native form GET behavior (no JS needed for URL navigation)
- Knows postgres.js tagged templates handle parameterized queries automatically (no manual `$1, $2`)
- Understands PGlite as in-memory PostgreSQL for test isolation (fresh DB per test)
- Knows to mock only external HTTP (Jikan), never database calls
- Writing tests before implementation (TDD approach)
- Understands user_id guard on DELETE — security pattern to prevent cross-user data access
- Understands entity_type validation (restrict to anime/manga)
- Understands Zod schema validation — `z.object()`, `z.string().min()`, `z.enum()`, `z.number()`
- Knows `schema.parse()` throws synchronously — use `try/catch`, not `.catch()`
- Knows Zod errors live in `.issues[0].message`, not `.errors`
- Understands custom error messages in Zod (`.min(n, "message")`, `z.enum([], { message })`)
- Understands why not to trust user input — server should verify against source of truth (Jikan API)
- Knows `vi.stubGlobal("fetch", ...)` goes inside individual tests, not at file level
- Knows `Promise.resolve` is a built-in JavaScript global (capital P), not a library import
