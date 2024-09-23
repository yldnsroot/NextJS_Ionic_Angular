// backend/utils/jwt.ts
import jwt from "jsonwebtoken";

const SECRET_KEY = "aa2986181c4239f28872e3052d346c06cf8cf0c173c429b559ba8e5392f2cb6"; 
// Store securely in environment variables

export const generateToken = (employee : any) => {
  return jwt.sign(
    { id: employee.id, email: employee.email, role: employee.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

export const verifyToken = (token: any) => {
  return jwt.verify(token, SECRET_KEY);
};
