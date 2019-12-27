import express from "express";
const router = express.Router();
import authController from "../controllers/auth";
import projectController from "../controllers/projects";

router.get("/", projectController.getItems);

router.post("/", authController.authenticate, projectController.addItem);

router.put("/", authController.authenticate, projectController.updateItem);

router.delete("/", authController.authenticate, projectController.deleteItem);

export default router;
