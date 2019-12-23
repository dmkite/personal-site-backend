import { Model } from './Model'
import { RedisKeys } from '../utils/redisConstants'

interface IAuthModel {
  getPassword(): Promise<string>
  changePassword(password: string): Promise<boolean>
}

class AuthModel extends Model implements IAuthModel {

  getPassword = async (): Promise<string> => {
    const client = super.createClient()
    try {
      const password = await client.getAsync(RedisKeys.Auth)
      return password
    } catch (err) {
      console.log(err)
      return null
    }
  }

  changePassword = async (newPassword: string): Promise<boolean> => {
    const client = super.createClient()
    try {
      await client.setAsync(RedisKeys.Auth, newPassword)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}

const authModel = new AuthModel()
export default authModel