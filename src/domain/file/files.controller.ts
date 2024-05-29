import express from "express";

const router = express.Router();

router.get("/upload", (req, res) => {
  res.status(200).json({ text: "hi" });
});

export default router;
