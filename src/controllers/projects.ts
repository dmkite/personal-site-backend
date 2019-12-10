import { Request, Response } from "express";
import projectModel, {IProjectTuple} from "../models/projects";

interface ISpec {
  [key: string]: string;
}

interface IDesc {
  [key: string]: string;
}

interface ITransformedData {
  title: string;
  svg: string;
  specs: ISpec[];
  description: IDesc[];
}

export const getProjects = async (req: Request, res: Response): Promise<Response> => {
  try {
    const rawData = await projectModel.getProjects();
    const transformedData = transformData(rawData);
    return res.status(200).send(transformedData);
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: err});
  }
};

const transformData = (data: IProjectTuple[]): ITransformedData[] => {
  return [];

};

export const addToProjects = async (req: Request, res: Response): Promise<Response> => {
  return res.send({message: "this endpoint doesn't exist yet"});
};

const isValidReq = (reqBody: any): boolean => {
  if (typeof reqBody !== "object") {
    return false;
  }
  const requiredFields: string[] = [
    "title", "svg", "platform", "framework", "units",
  ];
};
