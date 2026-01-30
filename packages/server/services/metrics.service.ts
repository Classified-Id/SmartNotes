import si from 'systeminformation';

import { SystemMetrics } from '../models/metrics.model';

export class MetricsService {
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const cpuTemp = await si.cpuTemperature();
      const cpuLoad = await si.currentLoad();
      const memory = await si.mem();
      const graphics = await si.graphics();

      let gpuTemperature: string | number = 'Недоступно';
      if (
        graphics.controllers.length > 0 &&
        graphics.controllers[0].temperatureGpu !== undefined
      ) {
        gpuTemperature = graphics.controllers[0].temperatureGpu;
      }

      return {
        gpuTemperature,
        temperature: cpuTemp.main,
        cpuLoad: cpuLoad.currentLoad,
        memoryUsed: memory.used,
        memoryTotal: memory.total,
      };
    } catch (err) {
      console.error('Ошибка при получении метрик:', err);
      throw new Error('Не удалось получить данные о метриках ПК');
    }
  }
}
