import { RedisKeys } from "../utils/redisConstants";
import { Model } from "./Model";

interface IAuthModel {
  getPassword(): Promise<string>;
  changePassword(password: string): Promise<boolean>;
}

class AuthModel extends Model implements IAuthModel {
  constructor() {
    super();
  }

  public getPassword = async (): Promise<string> => {
    const client = this.createClient();
    try {
      const password = await client.getAsync(RedisKeys.Auth);
      return password;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public changePassword = async (newPassword: string): Promise<boolean> => {
    const client = this.createClient();
    try {
      await client.setAsync(RedisKeys.Auth, newPassword);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

const authModel = new AuthModel();
export default authModel;
