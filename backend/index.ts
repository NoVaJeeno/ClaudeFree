import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { AutonomousAgent } from './agents/autonomous_agent';
import { SelfHealingAgent } from './agents/self_healing';
import { SecurityKernel } from './agents/security_kernel';

const app = new Hono();
const port = 3000;

// Security Middleware
app.use('*', async (c, next) => {
    const apiKey = c.req.header('X-API-KEY');
    if (apiKey !== process.env.API_KEY) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
});

const agent = new AutonomousAgent();
const healer = new SelfHealingAgent();
const security = new SecurityKernel();

// Status Endpoint
app.get('/api/status', async (c) => {
    return c.json({
        status: 'online',
        security_mode: 'STRICT',
        last_check: new Date().toISOString()
    });
});

app.post('/api/security/sync', async (c) => {
    const hash = await security.syncManifest();
    return c.json({ status: 'manifest_synced', hash });
});

// COMMAND-GATEWAY: Whitelist-only execution
app.post('/api/exec', async (c) => {
    const { command, args } = await c.req.json();
    const result = await agent.runCommand(command, args);
    return c.json({ status: 'success', result });
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
        socket.emit('health_status', intact ? "VERIFIED" : "MANIPULATED");
    });
});
