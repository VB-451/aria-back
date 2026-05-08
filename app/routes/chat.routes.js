import { Router } from "express";
import { askMessage } from "../controllers/chat.controller.js";

const router = Router();

router.post("/message", askMessage)

export default router;