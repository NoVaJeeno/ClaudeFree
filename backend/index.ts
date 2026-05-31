import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import http from 'http';
import { Server } from 'socket.io';
import util from 'util';
import fs from 'fs';

const execPromise = util.promisify(exec);
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Agenten-Management (Persistent in JSON-Datenbank)
const AGENTS_FILE = './agents_db.json';
if (!fs.existsSync(AGENTS_FILE)) fs.writeFileSync(AGENTS_FILE, JSON.stringify([]));

// API für Agenten-Steuerung
app.post('/api/agents/register', (req, res) => {
    const { name, task } = req.body;
    let agents = [];
    try { agents = JSON.parse(fs.readFileSync(AGENTS_FILE, 'utf-8')); } catch(e) {}
    agents.push({ name, task, id: Date.now() });
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents));
    res.json({ success: true, message: `Agent ${name} registriert.` });
});

// Bestehende Whitelist
const SAFE_COMMANDS = ['ls', 'git', 'npm', 'node', 'docker', 'pwd', 'whoami', 'touch', 'echo', 'mkdir', 'rm', 'cat', 'mv', 'cp', 'grep', 'find', 'curl'];

const isCommandSafe = (cmd: string) => SAFE_COMMANDS.includes(cmd.split(' ')[0]);

io.on('connection', (socket) => {
  socket.on('execute-command', async (data) => {
    if (!isCommandSafe(data.command)) {
      socket.emit('output', { error: 'Security Violation: Befehl "' + data.command.split(' ')[0] + '" nicht autorisiert.' });
      return;
    }
    try {
      const { stdout, stderr } = await execPromise(data.command);
      socket.emit('output', { stdout, stderr });
    } catch (error: any) {
      socket.emit('output', { error: error.message });
    }
  });
});

server.listen(PORT, () => console.log(`AetherOS Engine live auf Port ${PORT}`));
