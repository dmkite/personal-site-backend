import * as bluebird from "bluebird";
import * as redis from "redis";
const redisAsync: any = bluebird.Promise.promisifyAll(redis);
import shortid from "shortid";

export interface IModel {
  getItems(key: string): Promise<any[]>;
  addItem(key: string, entry: any): any;
  updateItem(key: string, entry: any): Promise<boolean>;
  deleteItem(key: string, id: number): Promise<boolean>;
}

interface IItem {
  [key: string]: any;
}

class Model implements IModel {
  public entity: any;

  public getItems = async (key: string): Promise<any[]> => {
    const client = this.createClient();
    try {
      const items = await client.hgetallAsync(key);
      Object.keys(items).forEach((id: string) => {
        items[id] = JSON.parse(items[id]);
      });
      return items;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  public addItem = async (key: string, entry: any) => {
    const client = this.createClient();
    const id: string = shortid();
    entry.id = id;
    const jsonEntry: string = JSON.stringify(entry);
    return client.hmsetAsync(key, [id, jsonEntry])
    .then( (res: any) => {
      console.log(res);
      return res;
    })
    .catch((err: any) => {
      console.log(err);
    });
  }

  public updateItem = async (key: string, entry: any): Promise<boolean> => {
    const client = this.createClient();
    try {
      const items = await this.getItems(key);
      items[entry.id] = entry;
      const updatedJsonEntry: string = JSON.stringify(entry);
      await client.hmsetAsync(key, [entry.id, updatedJsonEntry]);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public deleteItem = async (key: string, id: number): Promise<boolean> => {
    const client = this.createClient();
    try {
      const items: IItem = await this.getItems(key);
      if (!items) {
        return false;
      }
      client.hdelAsync(key, id);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public createClient = () => {
    const redisOptions = {
      db: 1,
      host: "127.0.0.1",
      port: 6379,

    };
    const client = redisAsync.createClient(redisOptions);
    return client;
  }
}

const model = new Model();

export default model;
