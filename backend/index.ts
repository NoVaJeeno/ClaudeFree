import express from 'express';
import securityRouter from './agents/security';
import selfHealingRouter from './agents/self_healing';

const app = express();
app.use(express.json());

// Mount agents
app.use('/api/security', securityRouter);
app.use('/api/self-healing', selfHealingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ClaudeFree Backend running on port ${PORT}`);
});
