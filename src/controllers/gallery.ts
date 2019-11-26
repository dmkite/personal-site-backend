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
  try {
    const galleryContent: Gallery[] = await galleryModel.getGallery();
    galleryContent && galleryContent.length
      ? res.status(200).send(galleryContent)
      : res.status(404).send({ message: "no gallery content available" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

export const addToGallery = async (req: Request, res: Response) => {
  if (!isValidReq(req.body)) {
    res.status(400).send({message: "Incorrect format for gallery items"});
  }
  try {
    const entryWasSuccessful: boolean = await galleryModel.addItem(req.body);
    if (entryWasSuccessful) {
      res.status(201).send({message: "successfully added"});
    } else {
      res.status(400).send({message: "nope"});
    }
  } catch (err) {
    res.status(500).send({message: err});
  }
};

const isValidReq = (reqBody: any) => {
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
