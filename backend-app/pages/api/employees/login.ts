// pages/api/employees/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { generateToken } from "../../../backend/utils/jwt";
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
      const { email, password } = req.body;

      const employeeRepository = AppDataSource.getRepository(Employee);
      const employee = await employeeRepository.findOne({
        where: { email },
        select: ["id", "email", "password", "role"],
      });

      if (!employee || !bcrypt.compareSync(password, employee.password)) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = generateToken(employee);
      return res.status(200).json({ token });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
