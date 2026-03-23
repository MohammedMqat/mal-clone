import { searchAnime } from "./controllers/anime-search.js";
import express from "express";
import { TopAnime } from "./controllers/top-anime.js";
import { animeDetails } from "./controllers/anime-details.js";
export const router = express.Router();

router.get("/api/top-anime", TopAnime);
router.get("/api/search", searchAnime);
router.get("/api/anime-details/:id", animeDetails);
