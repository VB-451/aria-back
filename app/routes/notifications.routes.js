import { Router } from "express";
import { getNotificationSSE } from "../controllers/notifications.controller.js";

const router = Router();

router.get("/", getNotificationSSE)

export default router;