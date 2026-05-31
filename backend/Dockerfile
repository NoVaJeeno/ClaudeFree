FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package.json ./
RUN npm install

# Copy source code
COPY backend ./

EXPOSE 3000

CMD ["npx", "ts-node", "index.ts"]
