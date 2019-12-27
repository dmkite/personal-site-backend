import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { credentials } from "../../../credentials";
import authModel from "../models/auth";

interface IAuthController {
  changePassword(req: Request, res: Response): Promise<Response>;
  authenticate(req: Request, res: Response, next: NextFunction): Response | void;
  logIn(req: Request, res: Response): Promise<Response>;
}

class AuthController implements IAuthController {
  private saltRounds: number;
  private twentyFourHours: number;
  constructor() {
    this.saltRounds = 10;
    this.twentyFourHours = 86400000;
  }

  public changePassword = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body || !req.body.newPassword || !req.body.oldPassword) {
      return res.status(400).send({ message: "New and old passwords are required" });
    }
    const {oldPassword, newPassword} = req.body;
    try {
      const passwordsMatch: boolean = await this.passwordsMatch(oldPassword);
      if (passwordsMatch) {
        const hashedNewPassword: string = await this.hashify(newPassword);
        const changedPassword: boolean = await authModel.changePassword(hashedNewPassword);
        if (changedPassword) {
          return res.status(200).send({ message: "Successfully updated password" });
        } else {
          return res.status(500).send({ message: "Failed to update password" });
        }
      } else {
        return res.status(400).send({message: "Old Password is incorrect"});
      }
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }

  public logIn = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body || !req.body.password) {
      return res.status(400).send({ message: "Provide a password" });
    }
    try {
      const passwordsMatch: boolean = await this.passwordsMatch(req.body.password);
      if (passwordsMatch) {
        const token: string = this.createToken();
        return res.status(200).send({ token });
      } else {
        return res.status(400).send({ message: "Password is incorrect" });
      }
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  }

  public authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.headers || !req.headers.authorization) {
      return res.status(401).send({ message: "No bearer token present" });
    }
    const [type, token]: string[] = (req.headers.authorization as string).split(" ");
    const decoded: any = jwt.verify(token, credentials.secret);
    if (Date.now() - decoded.timestamp > this.twentyFourHours) {
      return res.status(401).send({ message: "Reauthorization required" });
    }
    return next();
  }

  private hashify = async (password: string): Promise<string> => {
    try {
      const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  private passwordsMatch = async (password: string): Promise<boolean> => {
    try {
      const storedPassword: string = await authModel.getPassword();
      const passwordsMatch: boolean = await bcrypt.compare(password, storedPassword);
      return passwordsMatch;

    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private createToken = (): string => {
    const token = jwt.sign({ timestamp: Date.now() }, credentials.secret);
    return token;
  }
}

const authController = new AuthController();
export default authController;
