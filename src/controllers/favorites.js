import { db } from "../db.js";

  export function getFavorites(req, res) {
const username = req.user.username;
db.sql`SELECT * FROM favorites WHERE user_id = (SELECT id FROM users WHERE username = ${username})`
.then ((rows) => {
    res.json (rows);
})
.catch((err)=> {
    res.status(500).json ({message : "500 Internal Server Error"});

});
  }
  export function addFavorite(req, res) {
    const {entity_id, entity_type , title} = req.body;
    if (entity_type !== "anime" && entity_type !== "manga"){
return res.status(400).json({message : "entity_type must be anime or manga"});

    
}
if(!entity_id){
    return res.status(400).json ({message : "entity_id is required"});

    }
const username = req.user.username;
db.sql`INSERT INTO favorites (user_id, entity_id, entity_type, title)
VALUES ((SELECT id FROM users WHERE username = ${username}), ${entity_id}, ${entity_type},${title})
RETURNING *`
.then ((rows)=>{
    res.status(201).json(rows[0]);
})
.catch((err)=>{
    res.status(500).json({message : "500 Internal Server Error"});

});
  }

  export function deleteFavorite(req, res) {
const {id} = req.params;
const username = req.user.username;
db.sql`DELETE FROM favorites
WHERE id = ${id}
AND user_id = (SELECT id FROM users WHERE username = ${username})
RETURNING *`
.then((rows) => {
    if (rows.length === 0) {
      return res.status(404).json({ message: "favorite not found" });
    }
    res.status(200).json({ message: "favorite deleted" });
  })
  .catch((err) => {
    res.status(500).json({ message: "500 Internal Server Error" });
  });
  }