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

const PORT = process.env.PORT || 3001;

// Liefere die statischen Dateien aus dem 'out' Ordner des Frontends
const buildPath = path.join(__dirname, '../frontend/out');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// APIs
app.post('/api/agents/register', (req, res) => {
    res.json({ success: true });
});

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

server.listen(PORT, () => console.log(`AetherOS läuft im Static-Export Modus auf Port ${PORT}`));
