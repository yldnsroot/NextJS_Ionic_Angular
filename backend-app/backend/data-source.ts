// backend/data-source.ts
import { DataSource } from "typeorm";
import { Employee } from "./entities/Employee";

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "127.0.0.1",
  port: 1433, // Default MSSQL port
  username: "sa",
  password: "123456",
  database: "POC_DB",
  synchronize: true, // Automatically synchronize schema during development
  logging: true, // Optional: Enable SQL query logging for development
  options: { encrypt: false },
  entities: [Employee],
});
