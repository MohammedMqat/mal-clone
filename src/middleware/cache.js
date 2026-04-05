import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 15,
});

export const cacheMiddleware = (req, res, next) => {
  const cacheKey = `${req.method}:${req.url}`;
  // console.debug(cacheKey, "cached:", cache.has(cacheKey));
  if (cache.has(cacheKey)) {
    const { data } = cache.get(cacheKey);
    return res.json(data);
  }

  // Imad note: This is monkey patching the `res.json` call, i dont know of easier ways to pick up the response.body, that means if you dont use res.json it does not get cached.
  const oldResJson = res.json;

  res.json = function (data) {
    const time = Date.now();
    cache.set(cacheKey, { data, time });

    return oldResJson.call(this, data);
  };

  next();
};
