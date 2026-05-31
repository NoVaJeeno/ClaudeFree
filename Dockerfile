FROM node:18-alpine AS builder
WORKDIR /app

# Baue Frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Backend vorbereiten
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Finale Image-Struktur
FROM node:18-alpine
WORKDIR /app

# Kopiere Backend und Frontend-Build
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend/.next/standalone/frontend /app/frontend

EXPOSE 3001
CMD ["node", "backend/index.js"]
