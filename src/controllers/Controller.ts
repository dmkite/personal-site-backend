import {Request, Response} from 'express'
import {IModel} from '../models/Model'

interface IGalleryItem {
  id: number;
  title: string;
  desc: string;
  height: number;
  width: number;
  url: string;
  thumbnail: number;
}

interface IProjectItem {
  title: string
  image: string
  specs: {
    units?: number
    framework: string
    platform: string
    persistence: string
  },
  desc: {
    Description: string
    Architecture: string
    Impact: string
  }
}

interface IController {
  getItems(req: Request, res: Response): Promise<Response>
  addItem(req: Request, res: Response): Promise<Response>
  updateItem(req: Request, res: Response): Promise<Response>
  deleteItem(req: Request, res: Response): Promise<Response>
}

export default class Controller implements IController {
  public reqValidation: (req:Request)=>boolean
  public redisKey: string
  public model: IModel
  constructor(reqValidation: (req:Request)=>boolean, redisKey:string, model: IModel) {
    this.reqValidation = reqValidation
    this.redisKey = redisKey
    this.model = model
  }

  getItems = async (req: Request, res: Response) => {
    try {
      const items: Array<IGalleryItem | IProjectItem> = await this.model.getItems(this.redisKey);
      if (!items) {
        return res.status(404).send({message: "no items found"});
      } else {
        return res.status(200).send(items);
      }
    } catch (err) {
      return res.status(500).send({message: err})
    }
  }

  addItem = async (req: Request, res: Response) => {
    const isValidReq = this.reqValidation(req)
    if (!isValidReq ) {
      return res.status(400).send({message: "missing vital request information"});
    }
    try {
      const successfullyAdded = await this.model.addItem(this.redisKey, req.body);
      return successfullyAdded
        ? res.status(200).send({message: `successfully added ${req.body.title}`})
        : res.status(500).send({message: "failed to add item"});
    } catch(err) {
      return res.status(500).send({message:err})
    }
  }

  updateItem = async (req: Request, res: Response) => {
    const isValidReq = this.reqValidation(req)
    if ( !isValidReq ) {
      return res.status(400).send({message: "missing vital request information"});
    }
    try {
      const updatedSuccessfully: boolean = await this.model.updateItem(this.redisKey, req.body);
      return updatedSuccessfully
        ? res.status(200).send({message: `Successfully updated ${req.body.title}`})
        : res.status(500).send({message: `Could not update ${req.body.title}`})
    } catch (err) {
      return res.status(500).send({message: err})
    }
  }

  deleteItem = async (req: Request, res: Response) => {
    const isValidReq = this.reqValidation(req)
    if (!isValidReq {
      return res.status(400).send({message: "An id is needed to delete"});
    }
    try {
      const deletedSuccessfully: boolean = await this.model.deleteItem(this.redisKey, req.body.id);
      return deletedSuccessfully
        ? res.status(200).send({message: `Deleted ${req.body.id}`})
        : res.status(500).send({message: `Could not delete ${req.body.id}`})
    } catch (err) {
      res.status(500).send({message: err});
    }
  }
}