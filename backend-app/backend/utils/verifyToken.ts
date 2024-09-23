// backend/utils/verifyToken.ts
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./jwt";
import { CustomNextApiRequest } from '../types'; // Import the custom request type

export const verifyJwt = (handler: any) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check if the token is valid and contains the expected properties
    if (decoded) {
      req.user = decoded; // Assign the decoded user info to req.user
      return handler(req, res);
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyRole = (handler: any, role: string) => async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    
    // Check if the token is valid and contains the expected properties
    if (decoded) {    
      if (decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      return handler(req, res);
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};