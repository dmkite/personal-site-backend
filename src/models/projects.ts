import "reflect-metadata";
import { Connection, ConnectionOptionsReader, createConnection } from "typeorm";
import { credentials } from "../../../credentials";
import { factory } from "../../ConfigLog4j";
import { Project } from "../entity/Project";

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

class ProjectModel {
  private logger = factory.getLogger("model.Project");

  public async addProject(reqBody: IProjectTuple): Promise<boolean> {
    let connection: Connection | null = null;
    try {
      connection = await this.createConnection();
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
      connection = await this.createConnection();
      if (!connection) {
        return [];
      }
      const projects = await connection.manager.find(Project);
      return projects && projects.length
        ? projects
        : [];
    } catch (err) {
      this.logger.warn(err);
      return null;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  public createConnection = async () => {
    try {
      const connection: Connection = await createConnection({
        database: "personal_site",
        entities: [`${__dirname}/../entity/*.ts`],
        host: "45.55.179.56",
        logging: false,
        password: credentials.mysqlPassword,
        port: 3306,
        synchronize: true,
        type: "mysql",
        username: "dylan"
      });
      return connection;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

const projectModel = new ProjectModel();
export default projectModel;
