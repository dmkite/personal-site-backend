import express from "express";
import {getGallery as modelGetGallery} from "../models/gallery";

declare enum Clip_type {
  "top",
  "center",
  "bottom",
  "left",
  "right"
}

interface IGalleryTuple {
  id: number;
  title: string;
  description: string;
  clip_type: Clip_type;
  height: number;
  width: number;
  url: string;
  thumbnail?: number;
}

export const getGallery = async (req: express.Request, res: express.Response) => {
  try {
    const galleryContent: any = await modelGetGallery();
    galleryContent
      ? res.status(200).send(galleryContent)
      : res.status(404).send({ message: "no gallery content available" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
