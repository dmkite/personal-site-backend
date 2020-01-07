import * as bluebird from "bluebird";
import * as redis from "redis";
const redisAsync: any = bluebird.Promise.promisifyAll(redis);
import shortid from "shortid";
import { IGalleryItem, IParsedRedisHash, IProjectItem, IStringRedisHash } from "../controllers/Controller";

export interface IModel {
  getItems(key: string): Promise<IParsedRedisHash>;
  addItem(key: string, entry: IGalleryItem | IProjectItem): Promise<boolean>;
  updateItem(key: string, entry: IGalleryItem | IProjectItem): Promise<boolean>;
  deleteItem(key: string, id: number): Promise<boolean>;
}

export class Model implements IModel {
  public getItems = async (key: string): Promise<IParsedRedisHash> => {
    const client = this.createClient();
    try {
      const items: IStringRedisHash = await client.hgetallAsync(key);
      if (!items) {
        return null;
      }

      const parsedItems: IParsedRedisHash = Object.keys(items).reduce(
        (acc: IParsedRedisHash, id: string): IParsedRedisHash => {
          acc[id] = typeof items[id] === "string"
            ? JSON.parse(items[id])
            : items[id];
          return acc;
        }, {});
      return parsedItems;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public addItem = async (key: string, entry: IGalleryItem | IProjectItem): Promise<boolean> => {
    const client = this.createClient();
    const id: string = shortid();
    entry.id = id;

    const jsonEntry: string = JSON.stringify(entry);
    try {
      await client.hmsetAsync(key, [id, jsonEntry]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }

  }

  public updateItem = async (key: string, entry: IGalleryItem | IProjectItem): Promise<boolean> => {
    const client = this.createClient();
    try {
      const items: IParsedRedisHash = await this.getItems(key);
      if (!items) {
        return false;
      }
      items[entry.id] = entry;
      const updatedJsonEntry: string = JSON.stringify(entry);
      await client.hmsetAsync(key, [entry.id, updatedJsonEntry]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public deleteItem = async (key: string, id: number): Promise<boolean> => {
    const client = this.createClient();
    try {
      const items: IParsedRedisHash = await this.getItems(key);
      if (!items) {
        return false;
      }
      client.hdelAsync(key, id);
      return true;
    } catch (err) {
      console.error(err);
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
