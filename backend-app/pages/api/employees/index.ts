// pages/api/employees/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { logError } from "../../../backend/utils/logger";
import bcrypt from "bcryptjs";

AppDataSource.initialize();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (req.method === "GET") {
      const employees = await employeeRepository.find();
      res.status(200).json(employees);
    } else if (req.method === "POST") {
      const { name, email, password, position } = req.body;
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
