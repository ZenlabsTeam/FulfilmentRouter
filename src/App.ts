import * as console from 'console';
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as jsonpath from 'jsonpath';
import * as remoteRequest from 'request'
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
    router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {

      res.json({
        message: 'its working'
      });
    });

    router.post('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.log(JSON.stringify(req.body))
      const action: string = jsonpath.query(req.body, '$.result.action')[0];
      console.log(JSON.stringify(action));
      if (action === 'AddNumbers' ) {
        const nums = jsonpath.query(req.body, '$.result.parameters.a')[0];
        console.log(JSON.stringify(nums));
        let requestOptions: remoteRequest.Options = {
          method: 'POST',
          qs: {},
          headers: {},
          uri: 'https://mathservice.herokuapp.com/sum',
          useQuerystring: false,
          json: true,
          body: nums,
        };
        remoteRequest(requestOptions, (error, response, body) => {
          if (error) {
            console.log(JSON.stringify(error));
          } else {
            if (response.statusCode >= 200 && response.statusCode <= 299) {
              console.log(JSON.stringify(response));
              console.log(JSON.stringify(body));
              res.json({
                speech: `The total Amount is ${body}`,
                displayText: `The total Amount is ${body}`,
                source: 'Math Service'

              })
            } else {
              console.log('Error' + JSON.stringify(response));
            }
          }
        });

        ;
      }
      else {
        res.json({
          message: 'its working -' + req.body['result']['action'] + ' - '
          + req.body['result']['parameters']
        });
      }
    })
    this.express.use('/', router);
  }

}

export default new App().express;