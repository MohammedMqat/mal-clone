import { PGlite } from "@electric-sql/pglite";
import { db } from "../db.js";
import bcrypt from "bcrypt"
import { readFileSync } from "fs";
import { join } from "path";
import { beforeEach, afterEach } from "vitest";
process.env.JWT_SECRET = "test-secret";

const schema = readFileSync(join(import.meta.dirname, "..", "schema.sql"), "utf-8");

let pglite;

function createPgliteSql(pg) {
  return function sql(strings, ...values) {
    let text = "";
    strings.forEach((str, i) => {
      text += str;
      if (i < values.length) text += `$${i + 1}`;
    });
    return pg.query(text, values).then((r) => r.rows);
  };
}
  
beforeEach(async () => {
  pglite = new PGlite();
  db.sql = createPgliteSql(pglite);
  await pglite.exec(schema);
  const hash = await bcrypt.hash("hashed_password_123", 10);
  await pglite.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [
    "testuser",
    hash,
  ]);
});
afterEach(async () => {
  await pglite.close();
});
