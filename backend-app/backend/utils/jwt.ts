// backend/utils/jwt.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { logError } from "../../backend/utils/logger";

const SECRET_KEY = "aa2986181c4239f28872e3052d346c06cf8cf0c173c429b559ba8e5392f2cb6";

export const generateToken = (employee: any) => {
  return jwt.sign(
    { id: employee.id, email: employee.email, role: employee.role },
    SECRET_KEY,
    { expiresIn: "10h" }
  );
};

// Define a custom type for the payload you expect
interface UserJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const verifyToken = (token: string): UserJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Check if the decoded token is of type JwtPayload and contains your expected properties
    if (typeof decoded === 'object' && 'id' in decoded && 'email' in decoded && 'role' in decoded) {
      return decoded as UserJwtPayload; // Cast to the expected payload type
    }
    return null; // Return null if the token is invalid
  } catch (error) {
    logError(error);
    return null; // In case of an error, return null
  }
};
