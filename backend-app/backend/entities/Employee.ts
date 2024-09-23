// backend/entities/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  position: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: "User" })
  role: string;
}
