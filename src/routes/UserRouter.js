import express from "express";
import { findUsers } from "../controllers/UserController.js";
import { isAuth } from "../middlewares/AuthMiddleware.js";
const router = express.Router();

router.get("/", isAuth, findUsers);

export default router;
