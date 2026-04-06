import { Router } from "express";
import { getLastMessages, askMessage, deleteAllMessages, deleteMessage } from "../controllers/chat.controller.js";

const router = Router();

router.get("/last-messages", getLastMessages);
router.delete("/last-messages", deleteAllMessages)
router.delete("/message", deleteMessage)
router.post("/message", askMessage)

export default router;