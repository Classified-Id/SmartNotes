import express from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const router = express.Router();
const metricsController = new MetricsController();

router.get('/metrics', (req, res) => metricsController.getMetrics(req, res));

export default router;
