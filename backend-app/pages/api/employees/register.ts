// pages/api/employees/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { validate } from "class-validator";
import { logError } from "../../../backend/utils/logger";
import { initializeDataSource } from '../../../backend/utils/data-source-helper';
import cors, { runMiddleware } from '../../../backend/utils/cors-middleware';
import { CreateEmployeeDto } from '../../../backend/dto/create-employee.dto'; // Import the DTO
import { plainToClass } from 'class-transformer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    // Ensure that the data source is initialized
    await initializeDataSource();
    
    // Apply CORS middleware
    await runMiddleware(req, res, cors);
    
    if (req.method === "POST") {
      // Transform the incoming plain data into a CreateEmployeeDto instance
      const employeeDto = plainToClass(CreateEmployeeDto, req.body);

      // Validate the DTO
      const validationErrors = await validate(employeeDto); // Renamed to validationErrors
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors
          .map((error) => error.constraints ? Object.values(error.constraints) : [])
          .flat(); // Ensure valid constraints and flatten the array

        return res.status(400).json({ message: "Validation failed", errors: errorMessages });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(employeeDto.password, 8);

      // Prepare the employee entity for saving
      const employeeRepository = AppDataSource.getRepository(Employee);
      const newEmployee = employeeRepository.create({
        name: employeeDto.name,
        email: employeeDto.email,
        password: hashedPassword,
        position: employeeDto.position,
        isActive: true,
        role: "User",
      });

      // Try to save the new employee and catch unique constraint errors
      try {
        await employeeRepository.save(newEmployee);
        res.status(201).json(newEmployee);
      } catch (error) {
        // TypeScript narrowing for 'unknown' error type
        if (error instanceof Error) {
          const sqlError = error as any; // Cast the error to 'any' to check properties like 'number'
          
          // Check for MSSQL unique constraint violation error codes
          if (sqlError.number === 2601 || sqlError.number === 2627) {
            return res.status(400).json({ message: "Email already exists" });
          }
        }

        throw error;  // Re-throw other errors for logging
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
