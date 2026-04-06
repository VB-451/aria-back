import { Router } from "express";
import { generateVoice } from "../controllers/tts.controller.js";

const router = Router();

router.post("/generate", generateVoice)

export default router;