# Caching in Express

## Why Cache?

The Jikan API has a rate limit. If your app makes too many requests too quickly, Jikan will reject them with a `429 Too Many Requests` error. Caching lets your server store a response the first time it fetches data, then reuse that stored response for a period of time instead of hitting the external API again.

---

## The Core Idea

```
Request comes in
  → Do we have a fresh cached response?
      YES → return it immediately (no Jikan call)
      NO  → fetch from Jikan → store result in cache → return it
```

---

## A Simple In-Memory Cache

The simplest cache is just a plain JavaScript object stored in memory:

```js
const cache = {};
```

Each entry stores the **data** and the **time it was saved**:

```js
cache["top-anime"] = {
  data: { ... },
  savedAt: Date.now()
};
```

To check if a cached entry is still fresh, compare the current time to `savedAt`:

```js
const TTL = 60 * 1000; // 60 seconds in milliseconds
const entry = cache["top-anime"];

if (entry && Date.now() - entry.savedAt < TTL) {
  // cache hit — still fresh
} else {
  // cache miss — fetch new data
}
```

---

## Questions to Guide Your Implementation

1. Where should the cache object live — inside the controller, or outside it? Why does that matter?

2. What should happen if the cache has data but it's older than 60 seconds?

3. What key would you use to cache search results? (Hint: two searches for different queries should not share the same cache entry.)

4. What are the downsides of in-memory caching? (Think: what happens when the server restarts?)

---

## TTL (Time To Live)

TTL is how long a cached entry is considered valid. After the TTL expires, the next request fetches fresh data.

- Too short → cache barely helps, still hits rate limits
- Too long → users see stale data

A reasonable TTL for top anime: **60–300 seconds**.

---

## Where to Add Caching in This Project

| Controller         | Cache key suggestion |
| ------------------ | -------------------- |
| `top-anime.js`     | `"top-anime"`        |
| `anime-search.js`  | `"search:" + query`  |
| `anime-details.js` | `"anime:" + id`      |

---

## Further Reading

- [MDN: Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Node.js in-memory caching patterns](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- npm packages for more advanced caching: `node-cache`, `lru-cache`
