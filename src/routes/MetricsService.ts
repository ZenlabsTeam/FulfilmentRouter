
import * as express from 'express';
import * as Process from 'process';
export class MetricsService {

  public metrics(req: express.Request, res: express.Response, next: express.NextFunction): void {
    let returnValue:any = { status: 'UP'}
    if(Process){
      returnValue = {
        cpuUsage: Process.cpuUsage(),
        memoryUsage: Process.memoryUsage(),
        upTime: Process.uptime(),
        status: 'UP'
      }
    }
    res.status(200)
    .json(returnValue).end();
  }
}