const swaggerJsdoc = require('swagger-jsdoc');
const packageJson = require('../../../package.json');
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
    './src/infrastructure/web/controllers/*.ts',
    './src/application/dto/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
