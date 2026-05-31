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

// PORT Konfiguration
const PORT = process.env.PORT || 3001;

// 1. Frontend-Auslieferung: Wenn kein API-Pfad passt, liefere das Frontend aus
app.use(express.static(path.join(__dirname, '../frontend/.next/standalone/public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/.next/standalone/index.html'));
});

// 2. Deine API-Logik
app.post('/api/agents/register', (req, res) => {
    res.json({ success: true });
});

// 3. WebSocket Terminal
io.on('connection', (socket) => {
    socket.on('execute-command', async (data) => {
        try {
            const { stdout } = await execPromise(data.command);
            socket.emit('output', { stdout });
        } catch (e: any) {
            socket.emit('output', { error: e.message });
        }
    });
});

server.listen(PORT, () => console.log(`AetherOS läuft als Fullstack-Proxy auf Port ${PORT}`));
