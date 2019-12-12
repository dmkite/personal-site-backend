import express from "express";
// import {logIn} from "../controllers/auth";
const router = express.Router();

router.post("/", (req: express.Request, res: express.Response) => res.send({message: "ok"}));
export default router;
