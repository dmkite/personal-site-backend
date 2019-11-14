import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// An entity is a class that maps to a database table.
@Entity()
export class Gallery {
  @PrimaryGeneratedColumn()
    public id: number;

  @Column()
    public title: string;

  @Column()
    public description: string;

  @Column()
    public clip_type: string;

  @Column()
    public height: number;

  @Column()
    public width: number;

  @Column()
    public url: string;
}
