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
    console.log("hitting change password with ", req.body.password);
    try {
      const hashedOldPassword: string = await this.hashify(req.body.oldPassword);
      const passwordsMatch: boolean = await this.passwordsMatch(hashedOldPassword);
      if (passwordsMatch) {
        const hashedNewPassword: string = await this.hashify(req.body.newPassword);
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
      const hashedPassword: string = await this.hashify(req.body.password);
      const passwordsMatch: boolean = await this.passwordsMatch(hashedPassword);
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
    if (!req.headers || !req.headers.Authorization) {
      return res.status(401).send({ message: "No bearer token present" });
    }
    const [type, token]: string[] = (req.headers.Authorization as string).split(" ");
    const decoded: any = jwt.verify(token, credentials.secret);
    if (Date.now() - decoded.timestamp > this.twentyFourHours) {
      return res.status(401).send({ message: "Reauthorization required" });
    }
    return next();
  }

  private hashify = async (password: string): Promise<string> => {
    try {
      const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);
      console.log("hashed password is: ", hashedPassword);
      return hashedPassword;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  private passwordsMatch = async (password: string): Promise<boolean> => {
    const storedPassword: string = await authModel.getPassword();
    console.log(storedPassword);
    console.log(password);
    return storedPassword === password;
  }

  private createToken = (): string => {
    const token = jwt.sign({ timestamp: Date.now() }, credentials.secret);
    return token;
  }

}

const authController = new AuthController();
export default authController;
