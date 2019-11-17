import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {credentials} from "../../../credentials";
import contactModel from "../models/contact";

class ContactController {
  public sendMessage = async (req: Request, res: Response) => {
    console.log("sendmessage made");
    if (!req.body) {
      return res.status(400).send({message: "a request body must be present"});
    }
    const {name, email, message: msg} = req.body;
    const isValidReq: boolean = this.isValidReq(name, email, msg);
    if (!isValidReq) {
      return res.status(400).send({message: "name, email, or message are incorrectly formatted"});
    }
    try {
      const messageDidSend = await contactModel.sendMessage(name, email, msg);
      if (messageDidSend) {
        const token = this.createToken();
        return res.status(201).send({message: "message sent", token });
      }
      return res.status(500).send({meresultssage: "message was not sent"});
    } catch (err) {
      return res.status(500).send({message: err});
    }
  }

  public checkToken = (token: string): boolean => {
    const decoded: any = jwt.verify(token, credentials.privateKey);
    if (decoded) {
      return Number(decoded.timestamp) - Date.now() > 300000;
    } else {
      return false;
    }
  }

  public createToken = (): string => {
    const token = jwt.sign({timestamp: Date.now()}, credentials.privateKey);
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
