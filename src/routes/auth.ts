import express from "express";
import authController from "../controllers/auth";
const router = express.Router();

router.post("/", authController.logIn);
router.put("/", authController.authenticate, authController.changePassword);

export default router;
