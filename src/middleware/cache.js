const cacheMap = new Map();

export const cacheMiddleware = (req, res, next) => {
  const cacheKey = `${req.method}:${req.url}`;
  console.log(cacheKey);

  if (cacheMap.has(cacheKey)) {
    const cachedData = cacheMap.get(cacheKey);
    return res.json(cachedData);
  }

  const oldResJson = res.json;

  res.json = function (data) {
    cacheMap.set(cacheKey, data);

    return oldResJson.call(this, data);
  };

  next();
};
