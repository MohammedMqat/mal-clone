import { PGlite } from "@electric-sql/pglite";
import { db } from "../db.js";
import { readFileSync } from "fs";
import { join } from "path";
import { beforeEach, afterEach } from "vitest";

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
  await pglite.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [
    "testuser",
    "hashed_password_123",
  ]);
});
afterEach(async () => {
  await pglite.close();
});
