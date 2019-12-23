import model from "../models/Model";
import { RedisKeys } from "../utils/redisConstants";
import Controller, { IProjectItem } from "./Controller";

interface ISubKeys {
  [key: string]: string[];
  specs: string[];
  desc: string[];
}

const findMissingValues = (entry: IProjectItem): string[] => {
  const necessaryKeys: string[] = [
    "title", "image", "specs", "desc"
  ];

  const subKeys: ISubKeys = {
    desc: ["Description", "Architecture", "Impact"],
    specs: ["framework", "platform", "persistence"]
  };
  const missingVals: string[] = [];

  const checkSubKeys = (keyType: string): void => {
    subKeys[keyType].forEach((key: string) => {
       if (!(entry as any)[keyType][key]) {
         missingVals.push(keyType);
       }
    });
  };

  necessaryKeys.forEach((val: string): void => {
    if (val === "specs" || val === "desc") {
      (entry as any)[val]
        ? checkSubKeys(val)
        : missingVals.push(val);
    } else {
      if (!(entry as any)[val]) {
        missingVals.push(val);
      }
    }
  });

  return missingVals;
};

const projectController = new Controller(findMissingValues, RedisKeys.Projects, model);

export default projectController;
