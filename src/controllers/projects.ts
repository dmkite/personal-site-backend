import { Request } from 'express'
import model from '../models/Model'
import { RedisKeys } from "../utils/redisConstants"
import Controller, { IProjectItem } from "./Controller"

interface ISubKeys {
  [key: string]: string[]
  specs: string[]
  desc: string[]
}

const findMissingValues = (entry: IProjectItem) => {
  const necessaryKeys: string[] = [
    "title", "image", "specs", "desc"
  ]

  const subKeys: ISubKeys = {
    specs: ["framework", "platform", "persistence"],
    desc: ["Description", "Architecture", "Impact"]
  }
  const missingVals = []
  
  const checkSubKeys = (keyType: string, entry: IProjectItem) {
    subKeys[keyType].forEach((key:string) => {
      !entry[keyType][key] ?? missingVals.push(key)
    })
  }

  entry.specs
    ? checkSubKeys('specs', entry)
    : missingVals.push('specs')

  entry.desc
    ? checkSubKeys('desc', entry)
    : missingVals.push('specs')

}
