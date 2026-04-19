# Review Follow-ups — Week 6+7

Based on mentor review of database + auth work. Ordered by priority.

## Priority 1 — Security (do first)

- [ ] 1. Add `expiresIn` to `jwt.sign()` in `src/controllers/auth.js`
- [ ] 2. Harden the session cookie: add `sameSite: "lax"`, `secure` (prod only), and `maxAge` matching the JWT lifetime
- [ ] 3. Stop leaking `error.toString()` from `src/middleware/error.js` — send a generic message, log details server-side
- [ ] 4. Add a TODO comment on `/api/auth/login` noting that rate-limiting is missing (brute-force risk)

## Priority 2 — Schema fixes (`src/schema.sql`)

- [x] 5. Add `NOT NULL` to `user_id` and `entity_id` on the favorites table
- [x] 6. Change `user_id INTEGER REFERENCES users(id)` → add `ON DELETE CASCADE`
- [x] 7. Add `UNIQUE (user_id, entity_id, entity_type)` so a user can't save the same anime twice
- [x] 8. Add `created_at TIMESTAMP DEFAULT NOW()` on favorites (matches users)
- [x] 9. Fix formatting: lowercase `Check` → `CHECK`, remove stray spaces, add newline at EOF

## Priority 3 — Correctness / robustness

- [ ] 10. Include `user.id` in the JWT payload at login; use `req.user.id` in favorites queries to drop the `(SELECT id FROM users WHERE username = ...)` subquery
- [ ] 11. In `addFavorite`, check `response.ok` from Jikan before calling `.json()`; treat network errors as gateway errors (502), not internal (500)
- [ ] 12. Validate `:id` in `deleteFavorite` — use `z.coerce.number().int()` or `Number.isInteger` before hitting the DB
- [ ] 13. Replace `err.message.match(/unique|duplicate/i)` with `err.code === "23505"` (Postgres `unique_violation`)
- [ ] 14. In `register`, move the `const { username, password } = req.body` destructure **after** `registerschema.parse(req.body)`
- [ ] 15. Pick one error-handling pattern across controllers — prefer `next(err)` so `errorMiddleware` formats responses in one place (stop mixing direct `res.status(500)` in favorites.js)

## Priority 4 — Naming / conventions

- [x] 16. Rename `registerschema` → `registerSchema`, `loginschema` → `loginSchema`, `favouriteSchema` → `favoriteSchema` (consistent camelCase + American spelling to match `favorites` table)
- [x] 17. Update all imports that reference the old schema names
- [x] 18. Remove `console.log(data)` from `public/favorites/app.js`
- [x] 19. Group `src/router.js` sections with blank lines: auth → page routes → cached API
- [x] 20. Decide on `async/await` in `src/tests/setup.js` — CLAUDE.md now allows it in test infra

## Priority 5 — Test coverage gaps

- [x] 21. Test the Jikan 404 path in `favorites.test.js` — mock fetch to return `{ data: null }`, expect 404
- [x] 22. Add a route-level test: user A cannot delete user B's favorite via `DELETE /api/favorites/:id` (currently only tested at DB layer)
- [x] 23. Add a test that `entity_id: "not-a-number"` returns 400 (Zod's `z.number()` doesn't coerce)
- [x] 24. Add a test asserting the login response sets a cookie with `HttpOnly` flag
- [x] 25. Replace `.then(throw) / .catch(assert)` pattern in duplicate-username test with `expect(...).rejects.toThrow()`
