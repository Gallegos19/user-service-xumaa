# User Service

Microservicio de gestión de usuarios para la plataforma Xuma.

## Características

- Gestión de perfiles de usuario
- Preferencias de usuario
- Relaciones tutor/estudiante
- Restricciones de usuario
- Autenticación y autorización
- Documentación con Swagger

## Requisitos previos

- Node.js 18+
- npm 9+
- Docker y Docker Compose (opcional, para desarrollo local)
- PostgreSQL 14+

## Configuración del entorno

1. Clona el repositorio
2. Copia el archivo `.env.example` a `.env` y configura las variables de entorno necesarias
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
5. Ejecuta las migraciones:
   ```bash
   npx prisma migrate dev
   ```

## Ejecución

### Desarrollo

```bash
# Modo desarrollo con recarga en caliente
npm run start:dev

# O con depuración
npm run start:debug
```

### Producción

```bash
# Compilar el proyecto
npm run build

# Iniciar en producción
npm run start:prod
```

### Docker

```bash
# Construir la imagen
docker-compose build

# Iniciar los contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## Estructura del proyecto

```
src/
├── application/           # Lógica de la aplicación
│   ├── dto/               # Objetos de transferencia de datos
│   ├── services/          # Servicios de la aplicación
│   └── use-cases/         # Casos de uso
├── domain/               # Lógica de dominio
│   ├── entities/          # Entidades de dominio
│   ├── events/            # Eventos de dominio
│   ├── repositories/      # Interfaces de repositorios
│   └── value-objects/     # Objetos de valor
├── infrastructure/        # Infraestructura
│   ├── config/            # Configuraciones
│   ├── database/          # Configuración de base de datos
│   ├── web/               # Capa web (controladores, rutas, etc.)
│   └── messaging/         # Mensajería y eventos
└── shared/               # Código compartido
```

## Pruebas

```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas e2e
npm run test:e2e
```

## Documentación de la API

La documentación de la API está disponible en `/api-docs` cuando la aplicación está en ejecución en modo desarrollo.

## Variables de entorno

Crea un archivo `.env` basado en `.env.example` y configura las siguientes variables:

```env
# Server
NODE_ENV=development
PORT=3002

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/userdb?schema=public

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# Logging
LOG_LEVEL=info

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## Contacto

Equipo de Desarrollo Xuma - [@xuma](https://xuma.app)

---

Desarrollado con ❤️ por el equipo de Xuma
