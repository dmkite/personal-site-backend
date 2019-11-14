import express from "express";
const router = express.Router();
import {getGallery} from "../controllers/gallery";

router.get("/", getGallery);

export default router;
