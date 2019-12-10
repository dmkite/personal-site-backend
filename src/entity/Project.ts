import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// An entity is a class that maps to a database table.
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
    public id: number;

  @Column({length: 30})
    public title: string;

  @Column("varchar")
    public svg: string;

  @Column("varchar")
    public description: string;

  @Column("varchar")
    public architecture: string;

  @Column("varchar")
    public impact: string;

  @Column({length: 30})
    public framework: string;

  @Column({length: 30})
    public platform: string;

  @Column("int")
    public units: number;

}
