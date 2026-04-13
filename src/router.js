import path from "path";
import { register, login } from "./controllers/auth.js";
import { searchAnime } from "./controllers/anime-search.js";
import express from "express";
import { TopAnime } from "./controllers/top-anime.js";
import { animeDetails } from "./controllers/anime-details.js";
import { cacheMiddleware } from "./middleware/cache.js";
import { getFavorites ,addFavorite,deleteFavorite } from "./controllers/favorites.js";
import { requireAuth } from "./middleware/auth.js";
export const router = express.Router();
router.get("/api/favorites", requireAuth, getFavorites);
  router.post("/api/favorites", requireAuth, addFavorite);
  router.delete("/api/favorites/:id", requireAuth, deleteFavorite);

router.get("/search/:entityType", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "..", "public", "search", "index.html"));
});

router.get("/:entityType/:id", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "..", "public", "entity", "index.html"));
});
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
  router.use(cacheMiddleware); // This line caches whats after only

router.get("/api/:entityType/top", TopAnime);
router.get("/api/:entityType/search", searchAnime);
router.get("/api/:entityType/:id", animeDetails);
