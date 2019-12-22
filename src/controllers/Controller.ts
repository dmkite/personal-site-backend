import {Request, Response} from "express";
import {IModel} from "../models/Model";

export interface IGalleryItem {
  id: number;
  title: string;
  desc: string;
  height: number;
  width: number;
  url: string;
  thumbnail: number;
}

export interface IProjectItem {
  title: string;
  image: string;
  specs: {
    units?: number
    framework: string
    platform: string
    persistence: string
  };
  desc: {
    Description: string
    Architecture: string
    Impact: string
  };
}

interface IController {
  getItems(req: Request, res: Response): Promise<Response>;
  addItem(req: Request, res: Response): Promise<Response>;
  updateItem(req: Request, res: Response): Promise<Response>;
  deleteItem(req: Request, res: Response): Promise<Response>;
  validateReq(req:Request): string | null
}

export default class Controller implements IController {
  public missingValueFinder: (req: Request) => string[];
  public redisKey: string;
  public model: IModel;
  constructor(missingValueFinder: (req: Request) => string[], redisKey: string, model: IModel) {
    this.missingValueFinder = missingValueFinder;
    this.redisKey = redisKey;
    this.model = model;
  }

  public getItems = async (req: Request, res: Response) => {
    try {
      const items: Array<IGalleryItem | IProjectItem> = await this.model.getItems(this.redisKey);
      if (!items) {
        return res.status(404).send({message: "no items found"});
      } else {
        return res.status(200).send(items);
      }
    } catch (err) {
      return res.status(500).send({message: err});
    }
  }

  public addItem = async (req: Request, res: Response) => {
    const invalidDetails = this.validateReq(req);
    if (invalidDetails) {
      return res.status(400).send({message: invalidDetails});
    }
    try {
      const successfullyAdded = await this.model.addItem(this.redisKey, req.body);
      return successfullyAdded
        ? res.status(200).send({message: `successfully added ${req.body.title}`})
        : res.status(500).send({message: "failed to add item"});
    } catch (err) {
      return res.status(500).send({message: err});
    }
  }

  public updateItem = async (req: Request, res: Response) => {
    const invalidDetails = this.validateReq(req);
    if ( invalidDetails ) {
      return res.status(400).send({message: invalidDetails});
    }
    try {
      const updatedSuccessfully: boolean = await this.model.updateItem(this.redisKey, req.body);
      return updatedSuccessfully
        ? res.status(200).send({message: `Successfully updated ${req.body.title}`})
        : res.status(500).send({message: `Could not update ${req.body.title}`});
    } catch (err) {
      return res.status(500).send({message: err});
    }
  }

  public deleteItem = async (req: Request, res: Response) => {
    const invalidDetails = this.validateReq(req);
    if ( invalidDetails ) {
      return res.status(400).send({message: invalidDetails});
    }
    try {
      const deletedSuccessfully: boolean = await this.model.deleteItem(this.redisKey, req.body.id);
      return deletedSuccessfully
        ? res.status(200).send({message: `Deleted ${req.body.id}`})
        : res.status(500).send({message: `Could not delete ${req.body.id}`});
    } catch (err) {
      res.status(500).send({message: err});
    }
  }

  validateReq = (req: Request): string | null => {
    switch (req.method.toLowerCase()) {
      case "post":
      case "put":
        const missingVals = this.missingValueFinder(req.body);
        return missingVals.length
          ? `Request is missing the following values: ${missingVals}`
          : null;
      case "delete":
        if (!req.body || !req.body.id) {
          return "Request is missing an ID";
        }
      default:
        return null;
    }
  };
}
