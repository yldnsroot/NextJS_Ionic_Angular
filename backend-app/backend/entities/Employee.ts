import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })  // Ensure email is unique in the database
  email: string;

  @Column({ select: false }) // Password will not be selected by default
  password: string;

  @Column()
  position: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: "User" })
  role: string;

  @Column({ nullable: true, select: false }) // Token will not be selected by default
  resetToken: string;

  @Column({ nullable: true, select: false }) // Token expiration will not be selected by default
  resetTokenExpires: Date;

  @Column({ nullable: true })
  remark: string;
}
