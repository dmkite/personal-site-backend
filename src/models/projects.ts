import "reflect-metadata";
import { Connection, ConnectionOptionsReader, createConnection } from "typeorm";
import { credentials } from "../../../credentials";
import { factory } from "../../ConfigLog4j";
import { Project } from "../entity/Project";
import Model from "./Model";

export interface IProjectTuple {
  title: string;
  svg: string;
  description: string;
  architecture: string;
  impact: string;
  framework: string;
  platform: string;
  units: number;
}

class ProjectModel extends Model {
  private logger = factory.getLogger("model.Project");
  constructor() {
    super();
  }

  public async addProject(reqBody: IProjectTuple): Promise<boolean> {
    let connection: Connection | null = null;
    try {
      connection = await super.createConnection();
      let project = new Project();
      project = Object.assign(project, reqBody);
      await connection.manager.save(project);
      this.logger.info(`Successfully saved the following record\n${String(project)}`);
      return true;
    } catch (err) {
      this.logger.warn(err);
      return false;
    } finally {
      connection.close();
    }
  }

  public async getProjects(): Promise<Project[]> {
    let connection: Connection | null = null;
    try {
      connection = await super.createConnection();
      console.log(connection);
      if (!connection) {
        return [];
      }
      const projects = await connection.manager.find(Project);
      return projects && projects.length
        ? projects
        : [];
    } catch (err) {
      console.log("++++++++++++++++++++");
      console.log(err);
      this.logger.warn(err);
      return null;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}

const projectModel = new ProjectModel();
export default projectModel;
