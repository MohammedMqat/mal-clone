import path from "path";
import { register, login } from "./controllers/auth.js";
import { searchAnime } from "./controllers/anime-search.js";
import express from "express";
import { TopAnime } from "./controllers/top-anime.js";
import { animeDetails, animeStreaming } from "./controllers/anime-details.js";
import { cacheMiddleware } from "./middleware/cache.js";
import { getFavorites, addFavorite, deleteFavorite } from "./controllers/favorites.js";
import { requireAuth } from "./middleware/auth.js";
import { seasonal } from "./controllers/anime-seasonal.js";
export const router = express.Router();
router.post("/api/auth/register", register);
// TODO: rate-limiting is missing
router.post("/api/auth/login", login);

router.get("/api/favorites", requireAuth, getFavorites);
router.post("/api/favorites", requireAuth, addFavorite);
router.delete("/api/favorites/:id", requireAuth, deleteFavorite);

router.use(cacheMiddleware); // This line caches whats after only
router.get("/api/anime/seasonal", seasonal);

router.get("/api/:entityType/top", TopAnime);
router.get("/api/anime/:id/streaming", animeStreaming);
router.get("/api/:entityType/search", searchAnime);
router.get("/api/:entityType/:id", animeDetails);
router.get("/search/:entityType", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "..", "public", "search", "index.html"));
});
router.get("/:entityType/:id", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "..", "public", "entity", "index.html"));
});
