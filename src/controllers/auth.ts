import authModel from '../models/auth'

interface IAuthController {
  getPassword(): string
  changePassword(oldPassword: string, newPassword:string): boolean
  cryptify(password:string):string
}

class AuthController implements IAuthController {
  
}

const authController = new AuthController()
export default authController