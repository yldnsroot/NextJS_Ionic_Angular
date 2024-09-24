import { NextApiResponse } from "next";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { logError } from "../../../backend/utils/logger";
import { verifyJwt } from '../../../backend/utils/verifyToken';
import { initializeDataSource } from '../../../backend/utils/data-source-helper';
import { CustomNextApiRequest } from '../../../backend/types'; // Import the custom request type
import cors, { runMiddleware } from '../../../backend/utils/cors-middleware';
import { validate } from "class-validator";
import { UpdateEmployeeDto } from '../../../backend/dto/update-employee.dto'; // Import the Update DTO
import { plainToClass } from 'class-transformer';

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    // Ensure that the data source is initialized
    await initializeDataSource();

    // Apply CORS middleware
    await runMiddleware(req, res, cors);

    const { id } = req.query;
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (req.method === "PUT") {
      const employee = await employeeRepository.findOne({
        where: { id: Number(id) },
        select: ['id', 'name', 'email', 'position', 'isActive', 'role'], 
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Transform incoming plain data into a DTO instance
      const employeeDto = plainToClass(UpdateEmployeeDto, req.body);

      // Validate the DTO
      const validationErrors = await validate(employeeDto);
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors
          .map((error) => error.constraints ? Object.values(error.constraints) : [])
          .flat();
        return res.status(400).json({ message: "Validation failed", errors: errorMessages });
      }

      // Update only the fields that are present in the DTO
      employee.name = employeeDto.name ?? employee.name;
      employee.email = employeeDto.email ?? employee.email;
      employee.position = employeeDto.position ?? employee.position;
      employee.isActive = employeeDto.isActive !== undefined ? employeeDto.isActive : employee.isActive;      

      // Try to save the employee and catch unique constraint errors
      try {
        await employeeRepository.save(employee);
        res.status(201).json(employee);
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
      
      // Save the updated employee entity
      await employeeRepository.save(employee);
      res.status(200).json(employee);
    } else if (req.method === "DELETE") {
      const employee = await employeeRepository.findOne({ where: { id: Number(id) } });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await employeeRepository.remove(employee);
      res.status(204).send({});
    } else if (req.method === "GET") {
      const employee = await employeeRepository.findOne({
        where: { id: Number(id) },
        select: ['id', 'name', 'email', 'position', 'isActive', 'role'], 
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json(employee);
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyJwt(handler); // Apply JWT middleware
