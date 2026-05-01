import postgres from "postgres";

export const db = {
  sql: postgres(process.env.DATABASE_URL),
};
