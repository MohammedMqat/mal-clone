# Week 6+7 TODO — PostgreSQL, Auth, Favorites, Testing

## Phase 1 — Database Foundation (Week 6)

- [x] 1. Set up PostgreSQL locally and create the project database
- [x] 2. Design schema: `users` table and `favorites` table (with `entity_type` column to distinguish anime vs manga) with foreign key relationship
- [x] 3. Write `db/build.sql` with CREATE TABLE statements
- [x] 4. Write `db/build.js` build script to initialize the database
- [x] 5. Connect Express to PostgreSQL using the `Postgres.js` module
- [x] 6. Use parameterized queries (`$1, $2`) in all database queries

## Phase 2 — Authentication (Week 7)

- [ ] 7. Create `POST /api/register` — validate inputs, hash password with bcrypt, INSERT into users
- [ ] 8. Create `POST /api/login` — bcrypt compare, set cookie or JWT on success
- [ ] 9. Add server-side validation (username not empty, password min length, duplicate username check)
- [ ] 10. Add client-side validation on registration/login forms
- [ ] 11. Build auth middleware that checks cookie/JWT on protected routes

## Phase 3 — Favorites Feature (Week 6 + 7 combined)

- [ ] 12. Create `POST /api/favorites` (protected) — save an anime/manga to favorites
- [ ] 13. Create `GET /api/favorites` (protected) — fetch user's saved favorites
- [ ] 14. Create `DELETE /api/favorites/:id` (protected) — remove a favorite
- [ ] 15. Add "Save to favorites" button on detail page (only visible when logged in)
- [ ] 16. Build a "My Favorites" page to display saved anime/manga

## Phase 4 — Testing (Week 6 + 7)

- [x] 17. Set up a separate test database
- [x] 18. Test database queries (INSERT, SELECT, DELETE for users and favorites)
- [x] 19. Test auth routes (register, login, invalid credentials)
- [x] 20. Test protected routes (with and without valid session)
