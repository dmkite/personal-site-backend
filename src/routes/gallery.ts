import express from "express";
const router = express.Router();
import galleryController from "../controllers/gallery";

router.get("/", galleryController.getItems);

router.post("/", galleryController.addItem);

router.put("/", galleryController.updateItem);

router.delete("/", galleryController.deleteItem);

export default router;
