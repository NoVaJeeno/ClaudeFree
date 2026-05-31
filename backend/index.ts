import express from 'express';
import securityRouter from './agents/security';
import selfHealingRouter from './agents/self_healing';
import securityKernelRouter from './agents/security_kernel';
import autonomousAgentRouter from './agents/autonomous_agent';
import resilienceRouter from './agents/resilience';

const app = express();
app.use(express.json());

// Mount all agents
app.use('/api/security', securityRouter);
app.use('/api/security-kernel', securityKernelRouter);
app.use('/api/self-healing', selfHealingRouter);
app.use('/api/autonomous-agent', autonomousAgentRouter);
app.use('/api/resilience', resilienceRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ClaudeFree Backend fully integrated and running on port ${PORT}`);
});
