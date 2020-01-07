#! /usr/bin/env nodejs
import bodyParser from "body-parser";
import cors from "cors";
import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan";
import path from "path";
import {factory} from "./ConfigLog4j";
import contactController from "./src/controllers/contact";
import HttpException from "./src/exceptions/HttpException";
import authRouter from "./src/routes/auth";
import designRouter from "./src/routes/design";
import galleryRouter from "./src/routes/gallery";
import projectRouter from "./src/routes/project";

const log = factory.getLogger("server");

const port: string = process.env.PORT || "8080";
const app = express();

const root: string = process.env.ROOT || path.join("..", "front-end", "build");
app.use(express.static(root));
app.disable("x-powered-by");
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/api/gallery", galleryRouter);
app.post("/api/contact", contactController.sendMessage);
app.use("/api/projects", projectRouter);
app.use("/api/design", designRouter);
app.use("/api/auth", authRouter);

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/assets/*", (req, res) => {
  console.log(req.url);
  return res.sendFile(req.url, {root: path.join("..")});
});

app.get("/*", (req, res) => res.sendFile("index.html", {root}) );

app.use((req, res, next) => {
  return res.status(404).send({ message: "the endpoint you're looking for doesn't exist" });
});

app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
  log.error(err.message);
  res.status(err.status || 500).send({ message: err.message || "internal error" });
});

app.listen(port, () => log.info(`getting lit on port ${port}`));
