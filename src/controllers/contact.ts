import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {credentials} from "../../../credentials";
import contactModel from "../models/contact";

class ContactController {
  public sendMessage = async (req: Request, res: Response) => {
    if (!req.body) {
      return res.status(400).send({message: "a request body must be present"});
    }
    const {name, email, message: msg, token: reqToken} = req.body;

    let hasWaited: boolean = true;
    if (reqToken) { hasWaited = this.checkToken(reqToken); }
    if (!hasWaited) { return res.status(429).send({message: "You've been doing that alot. Wait a little while and try again."}); }

    const isValidReq: boolean = this.isValidReq(name, email, msg);
    if (!isValidReq) {
      return res.status(400).send({message: "name, email, or message are incorrectly formatted"});
    }
    try {
      const messageDidSend: boolean = await contactModel.sendMessage(name, email, msg);
      if (messageDidSend) {
        const token = this.createToken();
        return res.status(201).send({message: "message sent", token });
      }
      return res.status(500).send({message: "message was not sent"});
    } catch (err) {
      return res.status(500).send({message: err});
    }
  }

  public checkToken = (token: string): boolean => {
    const decoded: any = jwt.verify(token, credentials.secret);
    console.log(decoded);
    if (decoded) {
      return Date.now() - Number(decoded.timestamp) > 300000;
    } else {
      return false;
    }
  }

  public createToken = (): string => {
    const token = jwt.sign({timestamp: Date.now()}, credentials.secret);
    return token;
  }

  public isValidReq = (name: string, email: string, msg: string): boolean =>  {
    if (!name || !email || !msg) {
      return false;
    }
    if (!email.includes(".") || !email.includes("@")) {
      return false;
    }
    return true;
  }
}

const contactController = new ContactController();
export default contactController;
