// backend/entities/Employee.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength, Matches } from "class-validator";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @Column()
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Column()
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, {
    message: "Password must contain both letters and numbers",
  })
  password: string;

  @Column()
  @IsNotEmpty({ message: "Position is required" })
  position: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: "User" })
  role: string;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true })
  resetTokenExpires: Date;

  @Column({ nullable: true })
  remark: string;
}
