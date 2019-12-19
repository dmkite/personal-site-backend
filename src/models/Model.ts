import {Connection, createConnection} from "typeorm";
import { credentials } from "../../../credentials";
import {factory} from "../../ConfigLog4j";

interface IModel {
  // logger: any
  // entity: any
  // returnType: any
  // createConnection(): Promise<Connection | null>
  getItems(): any;
  addItem(item: any): Promise<boolean>;
  updateItem(id: number): boolean;
  deleteItem(id: number): boolean;
}

export default class Model<T> implements IModel {
  public logger: any;
  public entity: any;
  // returnType: any
  constructor(moduleName: string, entity: any) {
    this.logger = factory.getLogger(`model.${moduleName}`);
    this.entity = entity;
    // this.returnType = returnType

  }

  public getItems = async (): Promise<T[]> => {
    const connection: Connection | null = await this.createConnection();
    if (!connection) {
      return [];
    }
    try {
      const results = await connection.manager.find(this.entity);
      if (!results || !results.length) {
        return [];
      }
    } catch (err) {
      console.log(err);
      return null;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  public addItem = async (entry: any): Promise<boolean> => {
    const connection: Connection | null = await this.createConnection();
    if (!connection) {
      return false;
    }
    try {
      let item = new this.entity();
      item = Object.assign(item, entry);
      await connection.manager.save(item);
      this.logger.info(`successfully saved the following record\n${String(entry)}`);
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    } finally {
      if (connection) {
        await connection.close();
      }
    }

  }

  public updateItem = (id: number): boolean => {
    return true;
  }

  public deleteItem = (id: number): boolean => {
    return true;
  }

  private createConnection = async () => {
    try {
      const connection: Connection = await createConnection({
        database: "personal_site",
        entities: [`${__dirname}/../entity/*.ts`],
        host: "45.55.179.56",
        logging: false,
        password: credentials.mysqlPassword,
        port: 3306,
        synchronize: true,
        type: "mysql",
        username: "dylan"
      });
      return connection;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
