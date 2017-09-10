
import * as express from 'express';
import * as Process from 'process';
export interface MetricsType{
  status: string;
  cpuUsage?:NodeJS.CpuUsage;
  memoryUsage?:NodeJS.MemoryUsage;
  upTime?: number;

}
export class MetricsService {

  private static getMetrics():MetricsType{
    let returnValue:MetricsType; 
    if(Process.cpuUsage){
      returnValue = {
        cpuUsage: Process.cpuUsage(),
        memoryUsage: Process.memoryUsage(),
        upTime: Process.uptime(),
        status: 'UP'
      }
    }
    else{
      returnValue == { status: 'UP'}
    }
    return returnValue;
} 
  
  public metrics(req: express.Request, res: express.Response, next: express.NextFunction): void {
    res.status(200)
    .json(MetricsService.getMetrics()).end();
  }
}