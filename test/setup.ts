import { container } from '../src/infrastructure/config/container';
import { database } from '../src/infrastructure/config/database';

// Initialize any test-specific configurations here
const setupTestEnvironment = async () => {
  // Setup test database connection
  await database.connect();
  
  // You can add more test-specific setup here
};

export default setupTestEnvironment;
