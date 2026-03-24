import { app } from "../app.js";
import request from "supertest";
import { expect, vi, test } from "vitest";
import onePieceSearchStub from "./stubs/search-one-piece.json";

test("no query is provided", () => {
  return request(app).get("/api/search").expect(400);
});

test("search with valid query returns anime results", () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            title: "Naruto",
            score: 8.5,
            images: { jpg: { image_url: "some-url" } },
          },
        }),
    }),
  );
  return request(app).get("/api/search?q=naruto").expect(200);
});

test("search returns results matching stub data", () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve({
      json: () => Promise.resolve(onePieceSearchStub),
      ok: true,
    }),
  );
  return request(app)
    .get("/api/search?q=onepiece")
    .expect("content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(Array.isArray(res.body.data)).toBe(true);
    });
});
test("search returns 429 when Jikan is rate limited", () => {
  vi.stubGlobal("fetch", () =>
    Promise.resolve({
      status: 429,
      ok: false,
      json: () => Promise.resolve({ message: "rate limited" }),
    }),
  );
  return request(app).get("/api/search?q=naruto").expect(429);
});
