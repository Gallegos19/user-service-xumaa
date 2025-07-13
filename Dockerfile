# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Stage 2: Create the production image
FROM node:18-alpine

WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create logs directory
RUN mkdir -p ./logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3002

# Expose the application port
EXPOSE 3002

# Command to run the application
CMD ["node", "dist/main.js"]
