import express from "express";
const router = express.Router();
import {addToProjects, getProjects} from "../controllers/projects";

router.get("/", getProjects);

router.post("/", addToProjects);

export default router;
