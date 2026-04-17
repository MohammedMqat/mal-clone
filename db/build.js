import { db } from "../src/db.js";
import { readFileSync } from "fs";
import { join } from "path";

const schema = readFileSync(join(import.meta.dirname, "..", "src", "schema.sql"), "utf-8");

db.sql
  .unsafe(schema)
  .then(() => db.sql.end())
  .catch((err) => {
    console.log(err);
    db.sql.end();
  });
