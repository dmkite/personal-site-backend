// const knex = require("../db/knex");

// export const getGallery = () => {
//   return knex("gallery")
//     .select("*")
//     .then((data) => data)
//     .catch((err) => { throw err; });
// };

import "reflect-metadata";
import {createConnection} from "typeorm";
import {factory} from "../../ConfigLog4j";
import {Gallery} from "../entity/Gallery";
const log = factory.getLogger("model.Gallery");
import {credentials} from '../../../credentials'

export const getGallery = () => {
  return createConnection({
    database: "personal_site",
    host: "45.55.179.56",
    logging: false,
    password: credentials.mysqlPassword,
    port: 3306,
    synchronize: true,
    type: "mysql",
    username: "dylan"
  })
    .then( async (connection) => {
      // const gallery = new Gallery();
      // gallery.id = 4;
      // gallery.title = "test2";
      // gallery.description = "test2";
      // gallery.clip_type = "top";
      // gallery.height = 1;
      // gallery.width = 1;
      // gallery.url = "test";
      // await connection.manager.save(gallery);
      // const galleryRepository = await connection.getRepository(Gallery);
      const savedGallery = await connection.manager.find(Gallery);
      log.info(JSON.stringify(savedGallery));

      log.info("record successfully created");

      // await galleryRepository.save(gallery);
      return savedGallery;
    })
    .catch((error) => {
      log.error(String(error));
      return error;
    });
};
