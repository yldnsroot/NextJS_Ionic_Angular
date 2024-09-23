// pages/api/employees/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { validate } from "class-validator";
import { logError } from "../../../backend/utils/logger";
import { initializeDataSource } from '../../../backend/utils/data-source-helper';
import cors, { runMiddleware } from '../../../backend/utils/cors-middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    // Ensure that the data source is initialized
    await initializeDataSource();
    
    // Apply CORS middleware
    await runMiddleware(req, res, cors);
    
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

      const errors = await validate(newEmployee);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

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
