import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics.service';

export class MetricsController {
  private metricsService: MetricsService;

  constructor() {
    this.metricsService = new MetricsService();
  }

  async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await this.metricsService.getSystemMetrics();
      res.json(metrics);
    } catch (err) {
      let errorMessage = 'Неизвестная ошибка';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      res.status(500).json({ error: errorMessage });
    }
  }
}
