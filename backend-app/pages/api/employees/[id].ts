// pages/api/employees/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { AppDataSource } from "../../../backend/data-source";
import { Employee } from "../../../backend/entities/Employee";
import { logError } from "../../../backend/utils/logger";

AppDataSource.initialize();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const employeeRepository = AppDataSource.getRepository(Employee);

    if (req.method === "PUT") {
      const { name, email, position, isActive } = req.body;
      const employee = await employeeRepository.findOne({ where: { id: Number(id) } });

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
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    logError(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
