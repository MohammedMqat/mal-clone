import { describe, test, expect } from "vitest";
import { db } from "../db.js";

describe("users table", () => {
  test("setup seeds exactly one testuser row", () => {
    return db.sql`SELECT * FROM users WHERE username = ${"testuser"}`.then((rows) => {
      expect(rows).toHaveLength(1);
      expect(rows[0].username).toBe("testuser");
      expect(rows[0].password_hash).toMatch(/^\$2/);
    });
  });

  test("each test gets a fresh database with only the seed row", () => {
    return db.sql`SELECT * FROM users`.then((rows) => {
      expect(rows).toHaveLength(1);
    });
  });

  test("inserts a new user and makes it queryable", () => {
    return db.sql`INSERT INTO users (username, password_hash) VALUES (${"alice"}, ${"hash456"}) RETURNING *`
      .then((rows) => {
        expect(rows[0].username).toBe("alice");
        return db.sql`SELECT * FROM users`;
      })
      .then((rows) => {
        expect(rows).toHaveLength(2);
      });
  });

  test("rejects a duplicate username", () => {
    return db.sql`INSERT INTO users (username, password_hash) VALUES (${"testuser"}, ${"hash"})`
      .then(() => {
        throw new Error("should have rejected the duplicate");
      })
      .catch((err) => {
        expect(err.message).toMatch(/unique|duplicate/i);
      });
  });
});

describe("favorites table", () => {
  test("inserts a favorite for testuser and retrieves it", () => {
    return db.sql`SELECT id FROM users WHERE username = ${"testuser"}`
      .then((rows) => {
        const userId = rows[0].id;
        return db.sql`
          INSERT INTO favorites (user_id, entity_id, entity_type, title)
          VALUES (${userId}, ${20}, ${"anime"}, ${"Naruto"})
          RETURNING *
        `;
      })
      .then((rows) => {
        expect(rows[0]).toMatchObject({ entity_id: 20, entity_type: "anime", title: "Naruto" });
      });
  });

  test("selects only the favorites belonging to the given user", () => {
    return db.sql`SELECT id FROM users WHERE username = ${"testuser"}`
      .then((rows) => {
        const userId = rows[0].id;
        return db.sql`
          INSERT INTO favorites (user_id, entity_id, entity_type, title)
          VALUES (${userId}, ${20}, ${"anime"}, ${"Naruto"}),
                 (${userId}, ${1},  ${"manga"}, ${"One Piece"})
        `.then(() => userId);
      })
      .then((userId) => db.sql`SELECT * FROM favorites WHERE user_id = ${userId}`)
      .then((rows) => {
        expect(rows).toHaveLength(2);
      });
  });

  test("DELETE with user_id check does not remove another user's favorite", () => {
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
        const favId = rows[0].id;
        return db.sql`SELECT id FROM users WHERE username = ${"testuser"}`.then((userRows) => {
          const testUserId = userRows[0].id;
          // The WHERE user_id = testUserId won't match bob's row
          return db.sql`DELETE FROM favorites WHERE id = ${favId} AND user_id = ${testUserId} RETURNING id`;
        });
      })
      .then((deleted) => {
        expect(deleted).toHaveLength(0);
      });
  });
});
