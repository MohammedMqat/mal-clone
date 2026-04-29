import "./instrument.js";

import * as Sentry from "@sentry/node";

import path from "path";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { router } from "./router.js";
import { errorMiddleware } from "./middleware/error.js";

const publicDir = path.join(import.meta.dirname, "..", "public");

export const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use(express.static(publicDir));

app.use("/", router);

Sentry.setupExpressErrorHandler(app);
app.use(errorMiddleware);
