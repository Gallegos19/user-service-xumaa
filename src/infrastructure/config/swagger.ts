const swaggerJsdoc = require('swagger-jsdoc');
import * as path from 'path';
const packageJson = require(path.resolve(process.cwd(), 'package.json'));
const version = packageJson.version;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version,
      description: 'API para la gestión de usuarios y sus preferencias',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3002/',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
          name: 'Authorization',
          description: 'Ingresa el token JWT en el formato: Bearer <token>'
        },
      },
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: [
    // Source TypeScript definitions (development)
    './src/infrastructure/web/controllers/*.ts',
    './src/application/dto/*.ts',
    // Compiled JavaScript definitions (production)
    './dist/src/infrastructure/web/controllers/*.js',
    './dist/src/application/dto/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
