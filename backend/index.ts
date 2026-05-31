import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { AutonomousAgent } from './agents/autonomous_agent';
import { SelfHealingAgent } from './agents/self_healing';

const app = new Hono();
const port = 3000;
const agent = new AutonomousAgent();
const healer = new SelfHealingAgent();

// Health/Status Dashboard Endpoint für dein iPhone
app.get('/api/status', async (c) => {
    return c.json({
        status: 'online',
        healing_active: true,
        last_check: new Date().toISOString()
    });
});

// Autonomer Heilungs-Button für iPhone Zugriff
app.post('/api/heal', async (c) => {
    await healer.heal();
    return c.json({ status: 'healed', timestamp: new Date().toISOString() });
});

// Status von allen Tools (Analysetools Integration)
app.get('/api/tools', async (c) => {
    // Hier werden künftig alle 1000+ Analyse-Tools abstrahiert
    return c.json({
        linter: "active",
        security_scanner: "active",
        integrity_check: "passed",
        available_tools: ["tsc", "eslint", "docker-check", "git-audit"]
    });
});

const server = serve({
    fetch: app.fetch,
    port: port
}, (info) => {
    console.log(`System Online: http://localhost:${info.port}`);
    // Startet periodische Selbstheilung alle 60 Minuten autonom
    setInterval(() => healer.heal(), 3600000);
});

const io = new Server(server);
io.on('connection', (socket) => {
    socket.on('manual_heal', async () => {
        await healer.heal();
        socket.emit('status', 'Healing complete');
    });
});
