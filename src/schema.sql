CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS favorites (
id SERIAL PRIMARY KEY ,
user_id INTEGER REFERENCES users(id),
entity_id INTEGER ,
entity_type TEXT Check(entity_type IN ('manga','anime')) ,
title  TEXT NOT NULL

);