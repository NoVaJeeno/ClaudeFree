FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build TS to JS
RUN npm run build

EXPOSE 3000
# Run production start (node instead of ts-node)
CMD ["node", "dist/index.js"]
