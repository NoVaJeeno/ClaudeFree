# Basis-Image
FROM node:18-alpine AS builder
WORKDIR /app

# Kopiere die Ordner-Strukturen, ohne Abhängigkeit von einer Root package.json
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Installation & Build
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install

# Finale Stufe
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend/.next/standalone/frontend /app/frontend

EXPOSE 3001
CMD ["node", "backend/index.js"]
