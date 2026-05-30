import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { Server } from 'socket.io';
import { AutonomousAgent } from './agents/autonomous_agent';

const app = new Hono();
const port = 3000;

app.get('/', (c) => c.text('Autonomes System online - Volle Kontrolle aktiv'));

const server = serve({
  fetch: app.fetch,
  port: port
}, (info) => {
  console.log(`Backend läuft auf http://localhost:${info.port}`);
});

const io = new Server(server);
const agent = new AutonomousAgent();

io.on('connection', (socket) => {
  console.log('Agent verbunden');

  socket.on('agent_task', async (data: { cmd: string }) => {
    try {
      const result = await agent.runCommand(data.cmd);
      socket.emit('agent_result', result);
    } catch (e) {
      socket.emit('agent_result', e);
    }
  });

  socket.on('git_sync', async (data: { message: string }) => {
    try {
      const result = await agent.syncWithGitHub(data.message);
      socket.emit('git_result', result);
    } catch (e) {
      socket.emit('git_result', e);
    }
  });

  socket.on('chat_message', (msg: string) => {
    console.log('Chat:', msg);
    io.emit('chat_message', `ClaudeFree: ${msg}`);
  });
});
