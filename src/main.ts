import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { container } from './infrastructure/config/container';
import { database } from './infrastructure/config/database';
import { createUserRoutes } from './infrastructure/web/routes/userRoutes';
import { UserController } from './infrastructure/web/controllers/UserController';
import { TutorRelationshipController } from './infrastructure/web/controllers/TutorRelationshipController';
import { UserRestrictionsController } from './infrastructure/web/controllers/UserRestrictionsController';
import { logger } from './infrastructure/config/logger';
import { errorHandler } from './infrastructure/web/middleware/errorHandler';
import { swaggerSpec } from './infrastructure/config/swagger';

async function bootstrap() {
  // Initialize Express
  const app = express();

  // Initialize database connection
  await database.connect();

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Configuración CORS
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  }));

  // Initialize controllers
  const userController = container.get(UserController);
  const tutorRelationshipController = container.get(TutorRelationshipController);
  const userRestrictionsController = container.get(UserRestrictionsController);

  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));

  // API Routes
  app.use('/api/users', createUserRoutes(
    userController,
    tutorRelationshipController,
    userRestrictionsController
  ));

  // Serve Swagger JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Error handling middleware
  app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 3002;
  const server = app.listen(PORT, () => {
    logger.info(`User Service running on port ${PORT}`);
  });

  // Handle signals
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await database.disconnect();
    server.close(() => {
      logger.info('HTTP server closed');
    });
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    await database.disconnect();
    server.close(() => {
      logger.info('HTTP server closed');
    });
  });
}

// Start the application
bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
