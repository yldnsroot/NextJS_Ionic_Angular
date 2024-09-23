// backend/utils/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new winston.transports.File({ filename: "logs/combined.log" }), // Log all messages to a file
  ],
});

export const logError = (error: any) => {
  logger.error({
    message: error.message,
    stack: error.stack,
  });
};

export const logInfo = (message: string) => {
  logger.info(message);
};
