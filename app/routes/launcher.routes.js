import { Router } from "express";
import { getDirectoryPath, getExecutablePath } from "../controllers/launcher.controller.js";

const router = Router();

router.get("/select-directory", getDirectoryPath);
router.get("/select-executable", getExecutablePath);

export default router;