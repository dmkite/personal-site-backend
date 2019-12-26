import bcrypt from "bcrypt";
import {Request, Response} from "express";
import authModel from "../models/auth";

interface IAuthController {
  changePassword(req: Request, res: Response): Promise<Response>;
  hashify(password: string): Promise<string>;
  passwordsMatch(password: string): Promise<boolean>;
}

class AuthController implements IAuthController {
  public saltRounds: number;
  constructor() {
    this.saltRounds = 10;
  }

  public changePassword = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body || !req.body.password) {
      return res.status(400).send({message: "A new password is needed"});
    }
    try {
      const hashedPassword: string = await this.hashify(req.body.password);
      if (this.passwordsMatch(hashedPassword)) {
        const changedPassword: boolean = await authModel.changePassword(hashedPassword);
        if (changedPassword) {
          return res.status(200).send({message: "Successfully updated password"});
        } else {
          return res.status(500).send({message: "Failed to update password"});
        }
      }
    } catch (err) {
      return res.status(500).send({message: err});
    }
  }

  public hashify = async (password: string): Promise<string> => {
    try {
      const hashedPassword: string = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public passwordsMatch = async (password: string): Promise<boolean> => {
    const storedPassword: string = await authModel.getPassword();
    return storedPassword === password;
  }
}

const authController = new AuthController();
export default authController;
