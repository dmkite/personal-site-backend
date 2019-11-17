import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// An entity is a class that maps to a database table.
@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
    public id: number;

  @Column({length: 30})
    public title: string;

  @Column({length: 300})
    public description: string;

  @Column("int")
  public height: number;

  @Column("int")
  public width: number;

  @Column("text")
    public thumbnail: string;

  @Column("text")
    public image: string;
}
