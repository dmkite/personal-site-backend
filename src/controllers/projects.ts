import { Request, Response } from "express";
import projectModel, {IProjectTuple} from "../models/projects";

interface IKeyVal {
  [key: string]: string | number;
}

interface ITransformedData {
  title: string;
  svg: string;
  specs: IKeyVal[];
  desc: IKeyVal[];
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
  const transformedData: ITransformedData[] = data.map( (d) => {
    const {title, description, architecture, svg, impact, units, framework, platform} = d;
    const specs: IKeyVal[] = [{title}, {framework}, {platform}, {units}];
    const desc: IKeyVal[] = [{description}, {architecture}, {impact} ];
    return {title, svg, specs, desc};
  });
  console.log(transformedData);
  return transformedData;

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
