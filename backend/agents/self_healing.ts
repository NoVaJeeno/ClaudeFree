import { Router } from 'express';

const router = Router();

router.post('/check', (req, res) => {
    res.json({ status: 'healthy', message: 'Resilience kernel active' });
});

export default router;
