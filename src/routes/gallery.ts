import express from "express";
const router = express.Router();
import {addToGallery, getGallery} from "../controllers/gallery";

router.get("/", getGallery);

router.post("/", addToGallery);

export default router;
