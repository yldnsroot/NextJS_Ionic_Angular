// backend/types.ts
import { NextApiRequest } from 'next';

// Extend NextApiRequest to include a user property
export interface CustomNextApiRequest extends NextApiRequest {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}
