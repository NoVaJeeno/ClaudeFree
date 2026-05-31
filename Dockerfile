# Basis-Image mit Node.js 18
FROM node:18-alpine

# Setze Arbeitsverzeichnis
WORKDIR /app

# Installiere erforderliche Build-Tools
RUN apk add --no-cache bash

# Kopiere alle Project-Dateien
COPY . .

# Installiere Abhängigkeiten für beide Bereiche (Frontend & Backend)
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install && npm install -g ts-node

# Exponiere den Port
EXPOSE 3001

# Starte den Backend-Server
CMD ["ts-node", "backend/index.ts"]
