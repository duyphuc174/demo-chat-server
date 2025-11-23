import express from "express";
import {
  createConversation,
  getConversationById,
  getMyConversations,
} from "../controllers/ConversationController.js";
import { isAuth } from "../middlewares/AuthMiddleware.js";
const router = express.Router();

router.post("/", isAuth, createConversation);
router.get("/me", isAuth, getMyConversations);
router.get("/:id", isAuth, getConversationById);

export default router;
