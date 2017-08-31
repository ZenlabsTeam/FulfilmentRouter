
import * as express from 'express';

export class MetricsService{

  public   metrics(req: express.Request, res: express.Response, next: express.NextFunction):void {
        res.json({
           message: 'its working'
         });
       }
}