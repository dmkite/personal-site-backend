import authModel from '../models/auth'
import bcrypt from 'bcrypt'

interface IAuthController {
  changePassword(oldPassword: string, newPassword: string): Promise<boolean>
  hashify(password: string): Promise<string>
  passwordsMatch(password: string): Promise<boolean>
}

class AuthController implements IAuthController {
  saltRounds: number
  constructor() {
    this.saltRounds = 10
  }

  changePassword = async (password: string): Promise<boolean> => {
    try {
      if (this.passwordsMatch(password)) {
        
      }
    } catch(err) {

    }
  }

  hashify = async (password: string): Promise<string> => {
    try {
      const hashedPassword: string = await bcrypt.hash(password, this.saltRounds)
      return hashedPassword
    } catch (err) {
      console.log(err)
      return null
    }
  }

  passwordsMatch = async(password:string): Promise<boolean> => {
    const storedPassword: string = await authModel.getPassword()
    const hashedPassword: string = await this.hashify(password)
    return storedPassword === hashedPassword
  }
}

const authController = new AuthController()
export default authController