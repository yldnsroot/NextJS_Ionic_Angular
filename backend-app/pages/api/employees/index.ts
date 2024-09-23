// pages/api/employees/index.ts
import { NextApiResponse } from "next";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { logError } from "../../../backend/utils/logger";
import bcrypt from "bcryptjs";
import { verifyJwt } from '../../../backend/utils/verifyToken';
import { initializeDataSource } from '../../../backend/utils/data-source-helper';
import { CustomNextApiRequest } from '../../../backend/types'; // Import the custom request type

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {

    // Ensure that the data source is initialized
    await initializeDataSource();

    const employeeRepository = AppDataSource.getRepository(Employee);

    if (req.method === "GET") {

      // Get pagination parameters from query, with defaults
      const page = parseInt(req.query.page as string) || 1; // Default to page 1
      const limit = parseInt(req.query.limit as string) || 20; // Default to 20 records per page
      const skip = (page - 1) * limit;

      const [employees, total] = await employeeRepository.findAndCount({        
        select: ['id', 'name', 'email', 'position', 'isActive', 'role'],
        take: limit,
        skip: skip,
      });
      res.status(200).json({
        data: employees,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
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
};

export default verifyJwt(handler); // Apply JWT middleware