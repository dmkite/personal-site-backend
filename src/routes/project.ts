import express from "express";
const router = express.Router();
import projectController from "../controllers/projects";

router.get("/", projectController.getItems);

router.post("/", projectController.addItem);

router.put("/", projectController.updateItem);

router.delete("/", projectController.deleteItem);

export default router;
