// backend/utils/data-source-helper.ts
import { AppDataSource } from '../data-source';
import { logError } from "../../backend/utils/logger";

export const initializeDataSource = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Data Source has been initialized!');
    } else {
      // console.log('Data Source is already initialized.');
    }
  } catch (error) {
    logError(error);
    console.error('Error initializing Data Source:', error);
  }
};
