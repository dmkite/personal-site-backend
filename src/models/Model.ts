import * as bluebird from "bluebird";
import * as redis from "redis";
const redisAsync: any = bluebird.Promise.promisifyAll(redis);
import {factory} from "../../ConfigLog4j";

interface IModel {
  getItems(key: string): Promise<any[]>;
  addItem(key: string, entry: any): any;
  updateItem(id: number): boolean;
  deleteItem(id: number): boolean;
}

export default class Model implements IModel {
  public logger: any;
  public entity: any;
  // returnType: any
  constructor(moduleName: string, entity: any) {
    this.logger = factory.getLogger(`model.${moduleName}`);
    this.entity = entity;
    // this.returnType = returnType

  }

  public getItems = async (key: string): Promise<any[]> => {
    const client = this.createClient();
    return client.getAsync(key)
      .then( (res: any) => {
        return res;
      })
      .catch( (err: any) => {
        console.log(err);
      });
  }

  public addItem = async (key: string, entry: any) => {
    const client = this.createClient();
    let hasError = false;
    client.on("error", (err: any) => {
      hasError = true;
      console.log("Error " + err);
  });
    client.set(key, entry);
    if (hasError) {
      return false;
    } else {
      return true;
    }
  }

  public updateItem = (id: number): boolean => {
    return true;
  }

  public deleteItem = (id: number): boolean => {
    return true;
  }

  public createClient = () => {
    const redisOptions = {
      db: 1,
      host: "127.0.0.1",
      port: 6379,

    };
    // bluebird.promisifyAll(redis.RedisClient.prototype);
    // bluebird.promisifyAll(redis.Multi.prototype);
    const client = redisAsync.createClient(redisOptions);
    return client;
  }
}
