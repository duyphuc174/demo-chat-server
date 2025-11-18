import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Conversation API is running..." });
});

export default router;
