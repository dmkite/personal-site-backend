import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {credentials} from "../../../credentials";

class Model {
  public createConnection = async () => {
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

export default Model;
