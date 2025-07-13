# Stage 1: Builder - Compilación y generación de Prisma
FROM node:18-alpine AS builder

# Instala dependencias esenciales para Prisma y compilación
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Copia archivos necesarios para instalar dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependencias y genera cliente Prisma
RUN npm install
RUN npx prisma generate

# Copia todo el código fuente y construye
COPY . .
RUN npm run build

# Stage 2: Runtime - Imagen final optimizada
FROM node:18-alpine

# Instala solo OpenSSL (necesario para Prisma en producción)
RUN apk add --no-cache openssl

WORKDIR /app

# Copia solo lo necesario desde la etapa builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Configuración de logs y permisos
RUN mkdir -p ./logs && \
    chown -R node:node /app

USER node

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3002

# Exponer puerto y comando de inicio
EXPOSE 3002
CMD ["node", "dist/src/main.js"]