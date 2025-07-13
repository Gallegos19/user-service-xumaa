import { database } from '../src/infrastructure/config/database';

export default async () => {
  // Setup test database connection
  await database.connect();
  
  // You can add more global test setup here
  // For example, clearing test database, setting up test data, etc.
  
  console.log('Global test setup completed');
};
