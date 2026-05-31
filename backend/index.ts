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

// Status Endpoint
app.get('/api/status', async (c) => {
    return c.json({
        status: 'online',
        security_mode: 'ABSOLUT',
        last_check: new Date().toISOString()
    });
});

// REMOTECONTROL: Manifest-Sync vom iPhone aus
app.post('/api/security/sync', async (c) => {
    const hash = await security.syncManifest();
    return c.json({ status: 'manifest_synced', hash });
});

// COMMAND-GATEWAY: Autonome Ausführung von Terminal-Befehlen
app.post('/api/exec', async (c) => {
    const { command } = await c.req.json();
    // Validierung, dass nur zugelassene Command-Konzepte ausgeführt werden
    if (command.includes('rm -rf') || command.includes('sudo')) {
        return c.json({ status: 'error', message: 'Unauthorized command' }, 403);
    }
    const result = await agent.runCommand(command);
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
    // Manuelle Sicherheits-Checks
    socket.on('health_check', async () => {
        const intact = await security.verifySystemIntegrity();
        socket.emit('health_status', intact ? "VERIFIED" : "MANIPULATED");
    });
});
