import path from "path";

import { searchAnime } from "./controllers/anime-search.js";
import express from "express";
import { TopAnime } from "./controllers/top-anime.js";
import { animeDetails } from "./controllers/anime-details.js";
import { cacheMiddleware } from "./middleware/cache.js";
export const router = express.Router();

router.get("/anime/:id", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "..", "public", "anime", "index.html"));
});

router.use(cacheMiddleware);

router.get("/api/top-anime", TopAnime);
router.get("/api/search", searchAnime);
router.get("/api/anime-details/:id", animeDetails);
