import { describe, test, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";

// The database is NOT mocked — setup.js wires db.sql to a fresh PGlite
// instance before each test and seeds testuser (password: "hashed_password_123").
// Only external HTTP calls (Jikan) are ever mocked here.

describe("POST /api/auth/register", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns 400 when username is empty", () => {
    return request(app)
      .post("/api/auth/register")
      .send({ username: "", password: "secure123" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/username/i);
      });
  });

  test("returns 400 when password is shorter than 8 characters", () => {
    return request(app)
      .post("/api/auth/register")
      .send({ username: "alice", password: "short" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/password/i);
      });
  });

  test("returns 409 when username is already taken", () => {
    // "testuser" is seeded by setup.js before every test, so we can rely on it existing
    return request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "secure123" })
      .expect(409)
      .expect((res) => {
        expect(res.body.message).toMatch(/taken|already exists/i);
      });
  });

  test("creates user and returns 201 on valid input", () => {
    return request(app)
      .post("/api/auth/register")
      .send({ username: "alice", password: "secure123" })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("username", "alice");
        // Passwords and hashes must never appear in the response
        expect(res.body).not.toHaveProperty("password");
        expect(res.body).not.toHaveProperty("password_hash");
      });
  });
});

describe("POST /api/auth/login", () => {
  test("returns 400 when password field is missing", () => {
    return request(app).post("/api/auth/login").send({ username: "testuser" }).expect(400);
  });

  test("returns 401 when username does not exist", () => {
    return request(app)
      .post("/api/auth/login")
      .send({ username: "nobody", password: "hashed_password_123" })
      .expect(401)
      .expect((res) => {
        // Generic message — don't reveal whether it was the username or password that was wrong
        expect(res.body.message).toMatch(/invalid credentials/i);
      });
  });

  test("returns 401 when password is wrong", () => {
    return request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "wrongpassword" })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toMatch(/invalid credentials/i);
      });
  });

  test("returns 200 with user info and sets a session cookie on valid credentials", () => {
    return request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "hashed_password_123" })
      .expect(200)
      .expect((res) => {
        expect(res.headers["set-cookie"]).toBeDefined();
        expect(res.body).toHaveProperty("username", "testuser");
        // Hash must never leave the server
        expect(res.body).not.toHaveProperty("password_hash");
      });
  });
});
