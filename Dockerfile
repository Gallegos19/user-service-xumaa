# Stage 1: Builder
FROM node:18-alpine AS builder

# Instala dependencias CRÍTICAS para Prisma
RUN apk add --no-cache openssl python3 make g++ libc6-compat

WORKDIR /app

# Primero copia solo lo necesario para instalar dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instala dependencias y genera cliente Prisma
RUN npm ci --no-optional && \
    npx prisma generate

# Copia el resto del código y construye
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

# Instala OpenSSL explícitamente (SOLUCIÓN al error)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copia desde builder solo lo necesario
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma

# Configuración final
USER node
ENV NODE_ENV=production
ENV PORT=3002
EXPOSE 3002
CMD ["node", "dist/src/main.js"]