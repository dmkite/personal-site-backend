import express from "express";
const router = express.Router();
import authController from "../controllers/auth";
import galleryController from "../controllers/gallery";

router.get("/", galleryController.getItems);

router.post("/", authController.authenticate, galleryController.addItem);

router.put("/", authController.authenticate, galleryController.updateItem);

router.delete("/", authController.authenticate, galleryController.deleteItem);

export default router;
