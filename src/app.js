import path from "path";
import express from "express";
import { router } from "./router.js";
import morgan from "morgan"
import cookieParser from "cookie-parser";
const publicDir = path.join(import.meta.dirname, "..", "public");

export const app = express();

app.use(morgan("dev"))

app.use(express.json())
app.use(cookieParser())

app.use(express.static(publicDir));

app.use("/", router);
