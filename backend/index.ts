import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import http from 'http';
import { Server } from 'socket.io';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Erweiterte White-list für System-Tools inklusive Dateimanipulation
const SAFE_COMMANDS = ['ls', 'git', 'npm', 'node', 'docker', 'pwd', 'whoami', 'touch', 'echo', 'mkdir', 'rm', 'cat', 'mv', 'cp'];

const isCommandSafe = (cmd: string) => {
  const baseCmd = cmd.split(' ')[0];
  return SAFE_COMMANDS.includes(baseCmd);
};

io.on('connection', (socket) => {
  socket.on('execute-command', async (data) => {
    const { command } = data;
    
    if (!isCommandSafe(command)) {
      socket.emit('output', { error: 'Security Violation: Befehl "' + command.split(' ')[0] + '" nicht autorisiert.' });
      return;
    }

    try {
      const { stdout, stderr } = await execPromise(command);
      socket.emit('output', { stdout, stderr });
    } catch (error: any) {
      socket.emit('output', { error: error.message });
    }
  });
});

server.listen(3001, () => console.log('AetherOS Engine: System-Tools freigeschaltet.'));
