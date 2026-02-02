import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // email
  @Column({ unique: true })
  email: string;

  // password
  @Column()
  password: string;

  // first name
  @Column()
  firstName: string;

  // last name
  @Column()
  lastName: string;
}
