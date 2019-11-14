#! /usr/bin/env nodejs
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import {factory} from "./ConfigLog4j";
import HttpException from "./src/exceptions/HttpException";
import router from "./src/routes/gallery";
const log = factory.getLogger("server");

const port: string = process.env.PORT || "8080";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use("/gallery", router);
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use((req, res, next) => {
  res.status(404).send({ message: "the endpoint you're looking for doesn't exist" });
});

app.use((err: HttpException, req: express.Request, res: express.Response, next: express.NextFunction) => {
  log.error(err.message);
  res.status(err.status || 500).send({ message: err.message || "internal error" });
});

app.listen(port, () => log.info(`getting lit on port ${port}`));
