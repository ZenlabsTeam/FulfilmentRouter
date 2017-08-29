import * as console from 'console';
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as jsonpath from 'jsonpath';
// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();   
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req: express.Request , res: express.Response, next: express.NextFunction) => {
      
      res.json({
        message: 'its working'
      });
    });

    router.post('/', (req: express.Request , res: express.Response, next: express.NextFunction) => {
     console.log(JSON.stringify(req.body))
     const condtionLeft:any[] = jsonpath.query(req.body,'$.result.action' );
     console.log(JSON.stringify(condtionLeft));
      if(condtionLeft.indexOf( 'AddNumbers') >-1){
        const nums = jsonpath.query(req.body,'$.result.parameters.a' )[0];
        console.log(JSON.stringify(nums));
       const total = nums.reduce((sum,current) => sum+current);
        res.json({
          speech: `The total Amount is ${total}` ,
          displayText: `The total Amount is ${total}` ,
          source:'My Tool'

        });
      }
      else{
      res.json({
        message: 'its working -'+ req.body['result']['action'] + ' - '
        +req.body['result']['parameters']
      });
    }
    })
    this.express.use('/', router);
  }

}

export default new App().express;