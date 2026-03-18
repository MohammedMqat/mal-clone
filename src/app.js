import path from 'path'
import express from "express"

const publicDir = path.join(import.meta.dirname, "..", "public")
export const app = express();

app.use(express.static(publicDir))