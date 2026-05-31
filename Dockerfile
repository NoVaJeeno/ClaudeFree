# Basis-Image
FROM node:18-alpine AS builder
WORKDIR /app

# Kopiere alle benötigten Dateien einzeln
COPY package.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Installation
RUN cd frontend && npm install
RUN cd backend && npm install

# Build
COPY . .
RUN cd frontend && npm run build

# Finale Stufe
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend/.next/standalone/frontend /app/frontend

EXPOSE 3001
CMD ["node", "backend/index.js"]
