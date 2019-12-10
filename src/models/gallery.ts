import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {credentials} from "../../../credentials";
import {factory} from "../../ConfigLog4j";
import {IGalleryTuple} from "../controllers/gallery";
import { Gallery } from "../entity/Gallery";
import Model from "./Model";

export interface IGalleryItem {
  title: string;
  description: string;
  height: number;
  width: number;
  image: string;
  thumbnail: string;
}

class GalleryModel extends Model {
  private logger = factory.getLogger("model.Gallery");
  constructor() {
    super();
  }

  public addItem = async (reqBody: IGalleryTuple): Promise<boolean> => {
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
      let gallery = new Gallery();
      gallery = Object.assign(gallery, reqBody);

      await connection.manager.save(gallery);
      this.logger.info(`successfully saved the following record\n${String(gallery)}`);
      return true;
    } catch (error) {
        this.logger.error(error);
        this.logger.info(error);
        return false;
    }
  }

  public async getGallery(): Promise<Gallery[]> {
    const connection: Connection | null = await super.createConnection();
    console.log(connection);
    if (!connection) {
      return [];
    }
    try {
      const galleryItems = await connection.manager.find(Gallery);
      if (!galleryItems || ! galleryItems.length) {
        return [];
      } else {
        return galleryItems;
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
/*
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
  */
}

const galleryModel = new GalleryModel();
export default galleryModel;
