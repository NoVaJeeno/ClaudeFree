import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import securityRouter from './agents/security';
import selfHealingRouter from './agents/self_healing';
import securityKernelRouter from './agents/security_kernel';
import autonomousAgentRouter from './agents/autonomous_agent';
import resilienceRouter from './agents/resilience';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.json());

// Agenten-Routen
app.use('/api/security', securityRouter);
app.use('/api/security-kernel', securityKernelRouter);
app.use('/api/self-healing', selfHealingRouter);
app.use('/api/autonomous-agent', autonomousAgentRouter);
app.use('/api/resilience', resilienceRouter);

// WebSocket-Logik für Echtzeit-Entwicklerumgebung
io.on('connection', (socket) => {
    console.log('Entwickler verbunden:', socket.id);
    
    socket.on('chat_message', (msg) => {
        io.emit('chat_message', `ClaudeFree: Empfangen - "${msg}"`);
    });

    socket.on('agent_task', async (task) => {
        console.log('Agenten-Task:', task);
        // Hier wird später der autonome Agent aufgerufen
        io.emit('agent_result', { output: `Agent verarbeitet: ${task.cmd}` });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`ClaudeFree Weltklasse-Backend läuft auf Port ${PORT}`);
});
