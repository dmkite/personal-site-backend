import model from "../models/Model";
import {RedisKeys} from "../utils/redisConstants";
import Controller, {IDesignItem} from "./Controller";

const findMissingVals = (entry: IDesignItem): string[] => {
  const necessaryVals: string[] = [
    "images",
    "title",
    "description",
    "impact"
  ];
  const missingVals: string[] = necessaryVals.reduce((acc: string[], v: string): string[] => {
    if (!entry[v] || !entry[v].length) {
      acc.push(v)
    }
    return acc
  }, []);
  return missingVals;
};

const designController = new Controller(findMissingVals, RedisKeys.Design, model);
export default designController;
