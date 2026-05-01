import { app } from "./app.js";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const port = process.env.PORT || 9080;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
