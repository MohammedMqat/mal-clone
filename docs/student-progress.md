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

## Remaining

- [ ] Learn and apply caching on Express routes (e.g. cache Jikan responses to avoid rate limiting)
- [ ] Add unhappy path tests (rate limit simulation, invalid ID)
- [ ] Style all 3 pages with CSS

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
