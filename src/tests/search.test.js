import { describe, test, expect, vi, afterEach } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import onePieceSearchStub from "./stubs/search-one-piece.json";

// Only mock external HTTP calls (fetch to Jikan API), never database calls.

describe("GET /api/anime/search", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("returns 400 when no query is provided", () => {
    return request(app)
      .get("/api/anime/search")
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/query/i);
      });
  });

  test("returns 200 with an array of anime for a valid query", () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(onePieceSearchStub),
      }),
    );
    return request(app)
      .get("/api/anime/search?q=onepiece")
      .expect("content-type", /json/)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  test("returns 429 when Jikan is rate limited", () => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        status: 429,
        ok: false,
        json: () => Promise.resolve({ message: "rate limited" }),
      }),
    );
    return request(app).get("/api/anime/search?q=naruto").expect(429);
  });
});
