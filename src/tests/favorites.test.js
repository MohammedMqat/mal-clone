import { vi, afterEach, describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import { db } from "../db.js";
// We log in as that user to get a real session cookie, then use it on
// protected routes — no middleware mocking needed.

let sessionCookie;

beforeEach(() => {
  return request(app)
    .post("/api/auth/login")
    .send({ username: "testuser", password: "hashed_password_123" })
    .then((res) => {
      sessionCookie = res.headers["set-cookie"];
    });
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("GET /api/favorites", () => {
  test("returns 401 when not logged in", () => {
    return request(app).get("/api/favorites").expect(401);
  });

  test("returns an empty array when user has no favorites yet", () => {
    return request(app)
      .get("/api/favorites")
      .set("Cookie", sessionCookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });
});

describe("POST /api/favorites", () => {
  test("returns 401 when not logged in", () => {
    return request(app)
      .post("/api/favorites")
      .send({ entity_id: 20, entity_type: "anime", title: "Naruto" })
      .expect(401);
  });

  test("returns 400 when entity_type is not anime or manga", () => {
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_id: 20, entity_type: "movie", title: "Some Movie" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/entity_type/i);
      });
  });

  test("returns 400 when entity_id is missing", () => {
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_type: "anime", title: "Naruto" })
      .expect(400);
  });

  test("returns 400 when entity_id is not a number", () => {
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_id: "not-a-number", entity_type: "anime", title: "Naruto" })
      .expect(400);
  });

  test("returns 404 when Jikan has no data for the entity_id", () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: null }),
      }),
    );
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_id: 99999999, entity_type: "anime", title: "Ghost Anime" })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toMatch(/not found/i);
      });
  });

  test("saves the favorite and returns 201 with the created row", () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { title: "Naruto" } }),
      }),
    );
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_id: 20, entity_type: "anime", title: "Naruto" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({
          entity_id: 20,
          entity_type: "anime",
          title: "Naruto",
        });
      });
  });

  test("returns 409 when saving a duplicate favorite", () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { title: "Naruto" } }),
      }),
    );
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_id: 30, entity_type: "anime", title: "Naruto" })
      .expect(201)
      .then(() => {
        return request(app)
          .post("/api/favorites")
          .set("Cookie", sessionCookie)
          .send({ entity_id: 30, entity_type: "anime", title: "Naruto" })
          .expect(409)
          .expect((res) => {
            expect(res.body.message).toMatch(/already in favorites/i);
          });
      });
  });
});

describe("DELETE /api/favorites/:id", () => {
  test("returns 401 when not logged in", () => {
    return request(app).delete("/api/favorites/1").expect(401);
  });

  test("returns 404 when favorite does not exist", () => {
    return request(app).delete("/api/favorites/999").set("Cookie", sessionCookie).expect(404);
  });

  test("deletes a favorite and returns 200", () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: { title: "Naruto" } }),
      }),
    );
    return request(app)
      .post("/api/favorites")
      .set("Cookie", sessionCookie)
      .send({ entity_id: 20, entity_type: "anime", title: "Naruto" })
      .then((res) => {
        return request(app)
          .delete(`/api/favorites/${res.body.id}`)
          .set("Cookie", sessionCookie)
          .expect(200);
      });
  });

  test("returns 404 when trying to delete another user's favorite", () => {
    // Create bob directly in the DB with a favorite, then try to delete it as testuser
    return db.sql`INSERT INTO users (username, password_hash) VALUES (${"bob"}, ${"hash"}) RETURNING id`
      .then((rows) => {
        const bobId = rows[0].id;
        return db.sql`
          INSERT INTO favorites (user_id, entity_id, entity_type, title)
          VALUES (${bobId}, ${1}, ${"manga"}, ${"One Piece"})
          RETURNING id
        `;
      })
      .then((rows) => {
        const bobsFavoriteId = rows[0].id;
        return request(app)
          .delete(`/api/favorites/${bobsFavoriteId}`)
          .set("Cookie", sessionCookie)
          .expect(404);
      });
  });
});
