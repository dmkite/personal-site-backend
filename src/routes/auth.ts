import express from "express";
import authController from "../controllers/auth";
const router = express.Router();

router.put("/", authController.changePassword);

export default router;
