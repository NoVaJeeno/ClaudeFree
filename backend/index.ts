import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import util from 'util';
import fs from 'fs';

const execPromise = util.promisify(exec);
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3001');

// Pfad zum Frontend-Build
const buildPath = path.join(__dirname, '../frontend/out');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Server auf 0.0.0.0 binden, damit Docker-Container von außen erreichbar sind
server.listen(PORT, '0.0.0.0', () => console.log(`AetherOS läuft auf Port ${PORT}`));
