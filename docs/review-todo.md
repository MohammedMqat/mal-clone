# PR #9 Review TODO

## Security

- [x] 1. Fix XSS in related anime section — `public/entity/app.js:151-157` uses `innerHTML` with API data (`rel.relation`, `entry.name`), switch to `textContent` + `createElement`
- [x] 2. Fix XSS in meta tags — `public/entity/app.js:68` inserts `t.value` (from API) via `innerHTML`, switch to `textContent` + `createElement`
- [x] 3. Stop leaking `error.message` in older controllers — `src/controllers/anime-details.js:12,22` and `src/controllers/anime-seasonal.js:7` send `error.message` to the client, use `next(err)` instead
- [x] 4. Add rate-limiting TODO on `/api/auth/register` — currently only login has the comment

## Bugs / Correctness

- [x] 5. Fix `login` destructure order — `src/controllers/auth.js:30` destructures `req.body` before Zod parse on line 32; move destructure after validation (like `register` does)
- [x] 6. Add missing `return` on inner promise chain in `addFavorite` — `src/controllers/favorites.js:34` doesn't return the `db.sql` promise, so INSERT errors won't propagate to outer `.catch()`
- [x] 7. Check `response.ok` in `animeDetails` and `animeStreaming` — `src/controllers/anime-details.js:8,17` call `.json()` unconditionally, should handle 404/429
- [x] 8. Check `response.ok` in `seasonal` controller — `src/controllers/anime-seasonal.js:3`, same issue

## Code Quality

- [x] 9. Fix typo `drobDown` — `public/search/app.js:9`, rename to `dropDown` or `sortSelect`
- [x] 10. Fix `console.dir(JSON.stringify(error))` — `src/controllers/anime-seasonal.js:6`, use `console.error(error)` instead
- [x] 11. Fix inconsistent error response shape — `src/controllers/anime-details.js:5` returns a plain string, change to `{ message: "..." }` to match all other controllers
- [x] 12. Fix button text casing — `public/entity/app.js:106` says `"save to Favorites"`, capitalize consistently

## Route Design

- [x] 13. Document or restructure implicit cache boundary — `src/router.js:20`, route ordering determines what gets cached, fragile if new routes are added in the wrong spot
- [x] 14. Tighten catch-all `/:entityType/:id` route — `src/router.js:30-31` matches any two-segment path, consider restricting to `anime` and `manga`

## Testing

- [x] 15. Clarify `addFavorite` test — `src/tests/favorites.test.js:97` sends `title` in request body but controller ignores it and uses Jikan response; test passes by coincidence
- [x] 16. Add test for duplicate favorite — unique constraint exists but saving the same anime twice returns a generic 500 instead of 409; handle with `err.code === "23505"` and test for it

## Minor Nits

- [x] 17. Remove `@types/morgan` from devDependencies — not needed without TypeScript
- [x] 18. Consider gitignoring Yaak workspace files — `openapi/yaak.*.yaml` contain workspace-specific IDs
