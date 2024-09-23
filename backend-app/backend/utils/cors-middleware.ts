// backend/utils/cors-middleware.ts
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  origin: '*', // Allows all origins, or you can specify allowed origins
  credentials: true // Include cookies if needed
});

// Helper function to wait for the middleware to execute
export function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result:any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
