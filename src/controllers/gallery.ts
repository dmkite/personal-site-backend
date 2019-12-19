import {Request, Response} from "express";
import {Gallery} from "../entity/Gallery";
import galleryModel from "../models/gallery";

export interface IGalleryTuple {
  id: number;
  title: string;
  description: string;
  height: number;
  width: number;
  url: string;
  thumbnail: number;
}

export const getGallery = async (req: Request, res: Response) => {
  const galleryItems = await galleryModel.getItems("gallery");
  console.log(galleryItems, "dsdsdsd");
  if (galleryItems) {
    res.status(200).send(galleryItems);
  } else {
    res.status(404).send({message: "no items found"});
  }
//   try {
//     const galleryContent: any[] = await galleryModel.getItems();
//     galleryContent && galleryContent.length
//       ? res.status(200).send(galleryContent)
//       : res.status(404).send({ message: "no gallery content available" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({ message: err });
//   }
// };

// export const addToGallery = async (req: Request, res: Response) => {
//   if (!isValidReq(req.body)) {
//     res.status(400).send({message: "Incorrect format for gallery items"});
//   }
};

export const addToGallery = (req: Request, res: Response) => {
  if (!req || !req.body || !req.body.key || !req.body.entry) {
    return res.status(400).send({message: "missing vital request information"});
  }
  const {key, entry} = req.body;
  const successfullyAdded = galleryModel.addItem(key, entry);
  if (!successfullyAdded) {
    return res.status(500).send({message: "failed to add item"});
  } else {
    return res.status(200).send({message: "successfully added item"});
  }
};

const isValidReq = (reqBody: any): boolean => {
  if (typeof reqBody !== "object") { return false; }
  const necessaryValues: string[] = [
    "title",
    "description",
    "height",
    "width",
    "url",
    "thumbnail"
  ];
  for (const v of necessaryValues) {
    const isPresent: boolean = Boolean(reqBody[v]);
    if (!isPresent) { return false; }
  }
  return true;
};
