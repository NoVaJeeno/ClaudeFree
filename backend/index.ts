import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { AutonomousAgent } from './agents/autonomous_agent';
import { SelfHealingAgent } from './agents/self_healing';
import { SecurityKernel } from './agents/security_kernel';

const app = new Hono();
const port = 3000;
const agent = new AutonomousAgent();
const healer = new SelfHealingAgent();
const security = new SecurityKernel();

// Security Heartbeat Check
setInterval(async () => {
    const isIntact = await security.verifySystemIntegrity();
    if (!isIntact) {
        await security.deadManSwitchTrigger();
        process.exit(1);
    }
}, 60000); // Prüfe alle 60 Sekunden

app.get('/api/status', async (c) => {
    return c.json({
        status: 'online',
        security_mode: 'ABSOLUT',
        last_check: new Date().toISOString()
    });
});

app.post('/api/heal', async (c) => {
    await healer.heal();
    return c.json({ status: 'healed', timestamp: new Date().toISOString() });
});

const server = serve({
    fetch: app.fetch,
    port: port
}, (info) => {
    console.log(`SECURE CORE Online: http://localhost:${info.port}`);
});

const io = new Server(server);
io.on('connection', (socket) => {
    socket.on('health_check', async () => {
        const intact = await security.verifySystemIntegrity();
        socket.emit('health_status', intact ? "SYSTEM_INTEGRITY_VERIFIED" : "MANIPULATION_DETECTED");
    });
});
