import express from "express";
const router = express.Router();
import {addToGallery, deleteGalleryItem, getGallery, updateGalleryItem} from "../controllers/gallery";

router.get("/", getGallery);

router.post("/", addToGallery);

router.put("/", updateGalleryItem);

router.delete("/", deleteGalleryItem);

export default router;
