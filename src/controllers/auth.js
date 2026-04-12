import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function register(req, res, next) {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({ message: "username is empty" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "password is too short" });
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return db.sql`INSERT INTO users (username, password_hash) VALUES (${username}, ${hash}) RETURNING *`;
    })
    .then((rows) => {
      res.status(201).json({ username: rows[0].username });
    })
    .catch((err) => {
      if (err.message.match(/unique|duplicate/i)) {
        return res.status(409).json({ message: "username already taken" });
      }
      next(err);
    });
}

export function login(req, res, next) {
  const { username, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "password is missing" });
  }

  db.sql`SELECT * FROM users WHERE username = ${username}`
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(401).json({ message: "invalid credentials" });
      }
      const user = rows[0];
      return bcrypt.compare(password, user.password_hash).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "invalid credentials" });
        }
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({ username: user.username });
      });
    })
    .catch((err) => {
      next(err);
    });
}
