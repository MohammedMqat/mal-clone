import express from "express";
export const router = express.Router();
router.get("/trains", (req, res) => {
  res.status(200).json({
    data: [],
  });
});
