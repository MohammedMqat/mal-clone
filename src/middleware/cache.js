import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 15,
});

export const cacheMiddleware = (req, res, next) => {
  const cacheKey = `${req.method}:${req.url}`;
  console.log(cacheKey);

  if (cache.has(cacheKey)) {
    const { data } = cache.get(cacheKey);
    return res.json(data);
  }

  const oldResJson = res.json;

  res.json = function (data) {
    const time = Date.now();
    cache.set(cacheKey, { data, time });

    return oldResJson.call(this, data);
  };

  next();
};
