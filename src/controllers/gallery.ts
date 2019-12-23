import {Request} from "express";
import model from "../models/Model";
import { RedisKeys } from "../utils/redisConstants";
import Controller, {IGalleryItem} from "./Controller";

const findMissingValues = (entry: IGalleryItem): string[] => {
  const necessaryValues: string[] = [
    "title",
    "desc",
    "height",
    "width",
    "image",
    "thumbnail"
  ];

  const missingValues = necessaryValues.filter((v: string): boolean => {
    const val: string = (entry as any)[v];
    return val === undefined;
  });

  return missingValues;
};

const galleryController = new Controller(findMissingValues, RedisKeys.Gallery, model);

export default galleryController;
