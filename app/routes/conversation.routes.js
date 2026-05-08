import { Router } from "express";
import { retrieveConversation, changeBranch, deleteConversation, deleteInteraction } from "../controllers/conversation.controller.js";

const router = Router();

router.get("/last-messages", retrieveConversation);
router.post("/branch-switch", changeBranch);
router.delete("/last-messages", deleteConversation);
router.delete("/message", deleteInteraction);

export default router;