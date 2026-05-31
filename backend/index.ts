import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();

app.use(cors());
app.use(express.json());

// API Endpunkt für KI-Ausführung von System-Befehlen
app.post('/api/execute', async (req, res) => {
  const { command } = req.body;
  try {
    const { stdout, stderr } = await execPromise(command);
    res.json({ output: stdout, error: stderr });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Build-Status Endpoint
app.get('/api/build-status', async (req, res) => {
  // Integration für Build-Prozesse
  res.json({ status: 'ready', idle: true });
});

app.listen(3001, () => console.log('AetherOS Engine running on port 3001'));
