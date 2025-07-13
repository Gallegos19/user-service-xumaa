import { database } from '../src/infrastructure/config/database';

export default async () => {
  // Clean up test database connection
  await database.disconnect();
  
  // You can add more global test teardown here
  // For example, cleaning up test files, etc.
  
  console.log('Global test teardown completed');
};
