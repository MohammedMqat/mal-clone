import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function register(req, res) {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ message: "username is empty" });

    }
    if (password.length < 8) {
        return res.status(400).json({ message: "password is too short" });

    }
    bcrypt.hash(password, 10)
        .then((hash) => { return db.sql`INSERT INTO users (username, password_hash) VALUES (${username}, ${hash}) RETURNING *` })
        .then((rows) => { res.status(201).json({ username: rows[0].username }) })
        .catch((err) => {
            if (err.message.match(/unique|duplicate/i)) {
                return res.status(409).json({ message: "username already taken" });
            }
            return res.status(500).json({
                message: "500 Internal Server Error"
            });
        })}