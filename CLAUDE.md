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
| Route | File | Purpose |
|---|---|---|
| `/` | `public/index.html` | Top anime (home page) |
| `/search/` | `public/search/index.html` | Search anime by name |
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
- Express only acts as a static file server for the frontend

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
- [x] Fetch top anime from Jikan (`data.data` is the array)
- [x] Confirmed API response in console — array of 10 anime visible
- [ ] Loop through `data.data` with `.forEach()` and render cards using `container.innerHTML +=`
- [ ] Build search page with input + fetch on submit
- [ ] Build detail page that reads anime ID and fetches details
- [ ] Style all 3 pages with CSS

### Student Understanding Checkpoints
- Knows script tag goes at bottom of body (DOM must exist before JS runs)
- Knows `+=` vs `=` for innerHTML (preserves previous cards)
- Knows `.then()` chain — semicolon between chains breaks them
- Knows Jikan data lives at `data.data`, not at root
- Next step: write `.forEach()` loop to render cards with `container.innerHTML +=`
