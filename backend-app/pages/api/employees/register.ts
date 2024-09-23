// pages/api/employees/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { logError } from "../../../backend/utils/logger";

AppDataSource.initialize();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { name, email, password, position } = req.body;

      const employeeRepository = AppDataSource.getRepository(Employee);
      const hashedPassword = bcrypt.hashSync(password, 8);

      const newEmployee = employeeRepository.create({
        name,
        email,
        password: hashedPassword,
        position,
        isActive: true,
        role: "User",
      });

      await employeeRepository.save(newEmployee);
      res.status(201).json(newEmployee);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
