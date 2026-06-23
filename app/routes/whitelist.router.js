import { Router } from "express";
import { deleteGroup, deleteItem, getWhitelist, postKeyToNode, postNewGroupItem } from "../controllers/whitelist.controller.js";

const router = Router();

router.get("/", getWhitelist);
router.post("/new-group-item", postNewGroupItem);
router.post("/node", postKeyToNode);
router.delete("/group", deleteGroup);
router.delete("/item", deleteItem);

export default router;  