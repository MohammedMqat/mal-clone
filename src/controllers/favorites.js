import { db } from "../db.js";
import { favoriteSchema } from "../validation.js";
export function getFavorites(req, res, next) {
  db.sql`SELECT * FROM favorites WHERE user_id = ${req.user.id}`
    .then((rows) => {
      res.json(rows);
    })
    .catch((err) => {
      next(err);
    });
}
export function addFavorite(req, res, next) {
  let validatedBody;
  try {
    validatedBody = favoriteSchema.parse(req.body);
  } catch (err) {
    return res.status(400).json({ message: err.issues[0].message });
  }
  const { entity_id, entity_type, title } = validatedBody;
  fetch(`https://api.jikan.moe/v4/${entity_type}/${entity_id}`)
    .then((response) => {
      if (response.status === 404) {
        return res.status(404).json({ message: "anime/manga not found" });
      }
      if (!response.ok) {
        return res.status(502).json({ message: "failed to verify entity" });
      }
      return response.json();
    })
    .then((data) => {
      if (!data) return;
      if (!data.data) {
        return res.status(404).json({ message: "anime/manga not found" });
      }
      db.sql`INSERT INTO favorites (user_id, entity_id, entity_type, title)
             VALUES (${req.user.id}, ${entity_id}, ${entity_type},${title})
             RETURNING *`
        .then((rows) => {
          res.status(201).json(rows[0]);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
}
export function deleteFavorite(req, res, next) {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ message: "the client sent a bad request" });
  }
  db.sql`DELETE FROM favorites
WHERE id = ${id}
AND user_id = ${req.user.id}
RETURNING *`
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(404).json({ message: "favorite not found" });
      }
      res.status(200).json({ message: "favorite deleted" });
    })
    .catch((err) => {
      next(err);
    });
}
