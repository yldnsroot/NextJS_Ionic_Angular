// pages/api/employees/[id].ts
import { NextApiResponse } from "next";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { logError } from "../../../backend/utils/logger";
import { verifyJwt } from '../../../backend/utils/verifyToken';
import { initializeDataSource } from '../../../backend/utils/data-source-helper';
import { CustomNextApiRequest } from '../../../backend/types'; // Import the custom request type

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {

    // Ensure that the data source is initialized
    await initializeDataSource();

    const { id } = req.query;
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (req.method === "PUT") {
      const { name, email, position, isActive } = req.body;
      const employee = await employeeRepository.findOne({
        where: { id: Number(id) }
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      employee.name = name || employee.name;
      employee.email = email || employee.email;
      employee.position = position || employee.position;
      employee.isActive = isActive !== undefined ? isActive : employee.isActive;

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