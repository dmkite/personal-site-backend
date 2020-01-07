import express from "express";
const router = express.Router();
import designController from "../controllers/design";

router.get("/", designController.getItems);

export default router;
