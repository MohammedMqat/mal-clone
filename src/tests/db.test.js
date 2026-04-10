import { test, expect } from "vitest";
import { db } from "../db.js";

test("seeded user exists in the database", () => {
  return db.sql`SELECT * FROM users WHERE username = ${"testuser"}`.then((rows) => {
    expect(rows).toHaveLength(1);
    expect(rows[0].username).toBe("testuser");
    expect(rows[0].password_hash).toBe("hashed_password_123");
  });
});

test("each test gets a fresh database", () => {
  return db.sql`SELECT * FROM users`.then((rows) => {
    expect(rows).toHaveLength(1);
  });
});

test("can insert and query users", () => {
  return db.sql`INSERT INTO users (username, password_hash) VALUES (${"alice"}, ${"hash456"}) RETURNING *`
    .then((rows) => {
      expect(rows[0].username).toBe("alice");
      return db.sql`SELECT * FROM users`;
    })
    .then((rows) => {
      expect(rows).toHaveLength(2);
    });
});
