import express from "express";
import { isAuth } from "../middlewares/AuthMiddleware.js";
import { sendMessage, getMessages } from "../controllers/MessageController.js";

const router = express.Router();

router.post("/send", isAuth, sendMessage);
router.get("/", isAuth, getMessages);

export default router;
