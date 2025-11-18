import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Message API is running..." });
});

export default router;
