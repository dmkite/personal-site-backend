import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

// An entity is a class that maps to a database table.
@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
    public id: number;

  @Column("varchar")
    public password: string;
}
