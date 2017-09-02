
import * as express from 'express';
import * as Process from 'process';
export class MetricsService {

  public metrics(req: express.Request, res: express.Response, next: express.NextFunction): void {
    res.status(200)
    .json({
      cpuUsage: Process.cpuUsage(),
      memoryUsage: Process.memoryUsage(),
      upTime: Process.uptime(),
      status: 'UP'
    }).end();
  }
}