# Multi-stage build: build React app and package Electron app

# Stage 1: build React renderer
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . ./
RUN npm run build

# Stage 2: runtime image
FROM node:18-bullseye-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY electron-main.js preload.js ./
COPY node_modules ./node_modules
EXPOSE 3000
CMD ["node", "electron-main.js"]
