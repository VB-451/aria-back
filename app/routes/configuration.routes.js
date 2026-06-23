import { Router } from "express";
import { changeParameter, retrieveConfig } from "../controllers/configuration.controller.js";

const router = Router();

router.get("/", retrieveConfig)
router.patch("/", changeParameter)

export default router;