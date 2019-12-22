import {Request, Response} from "express";
import galleryModel from "../models/gallery";
import { RedisKeys } from "../utils/redisConstants";

// export interface IGalleryTuple {
//   id: number;
//   title: string;
//   desc: string;
//   height: number;
//   width: number;
//   url: string;
//   thumbnail: number;
// }


// export const getGallery = async (req: Request, res: Response) => {
//   const galleryItems: IGalleryTuple[] = await galleryModel.getItems(RedisKeys.Gallery);
//   if (!galleryItems) {
//     return res.status(404).send({message: "no items found"});
//   } else {
//     return res.status(200).send(galleryItems);
//   }
// };

// export const addToGallery = async (req: Request, res: Response) => {
//   if (!req || !req.body ) {
//     return res.status(400).send({message: "missing vital request information"});
//   }
//   const successfullyAdded = await galleryModel.addItem(RedisKeys.Gallery, req.body);
//   if (!successfullyAdded) {
//     return res.status(500).send({message: "failed to add item"});
//   } else {
//     return res.status(200).send({message: `successfully added ${req.body.title}`});
//   }
// };

// export const updateGalleryItem = async (req: Request, res: Response) => {
//   if ( !isValidReq(req) ) {
//     return res.status(400).send({message: "missing vital request information"});
//   }
//   const updatedSuccessfully: boolean = await galleryModel.updateItem(RedisKeys.Gallery, req.body);
//   if (updatedSuccessfully) {
//     return res.status(200).send({message: `Successfully updated ${req.body.title}`});
//   } else {
//     return res.status(500).send({message: "uh oh"});
//   }
// };

// export const deleteGalleryItem = async (req: Request, res: Response) => {
//   if (!isValidReq(req)) {
//     return res.status(400).send({message: "An id is needed to delete"});
//   }
//   try {
//     const deletedSuccessfully: boolean = await galleryModel.deleteItem(RedisKeys.Gallery, req.body.id);
//     if (!deletedSuccessfully) {
//       res.status(500).send({message: `Could not delete ${req.body.id}`});
//     } else {
//       res.status(200).send({message: `Deleted ${req.body.id}`});
//     }
//   } catch (err) {
//     res.status(500).send({message: err});
//   }
// };

const isValidReq = (req: Request): boolean => {
  switch (req.method.toLowerCase()) {
    case "post":
    case "put":
      if (!req.body || !hasValidValues(req.body)) {
        return false;
      }
    case "delete":
      if (!req.body || !req.body.id) {
        return false;
      }
    default:
      return true;
  }
};

const hasValidValues = (entry: any): boolean => {
  const necessaryValues: string[] = [
    "title",
    "desc",
    "height",
    "width",
    "image",
    "thumbnail"
  ];
  for (const v of necessaryValues) {
    const isPresent: boolean = Boolean(entry[v]);
    if (!isPresent) { return false; }
  }
  return true;
};
