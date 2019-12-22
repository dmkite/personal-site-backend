import {Request} from "express";
import model from "../models/Model";
import { RedisKeys } from "../utils/redisConstants";
import Controller from "./Controller";

const findMissingValues = (entry: any): string[] => {
  const necessaryValues: string[] = [
    "title",
    "desc",
    "height",
    "width",
    "image",
    "thumbnail"
  ];
  const missingValues = necessaryValues.filter((v: string): boolean => entry[v] === undefined);
  return missingValues;
};

const galleryController = new Controller(findMissingValues, RedisKeys.Gallery, model);

export default galleryController;
