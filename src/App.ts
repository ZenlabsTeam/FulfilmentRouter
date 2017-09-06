import * as console from 'console';
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as basicAuth from 'express-basic-auth'
import * as fullfilmentService from './routes/FulfilmentService';
import * as metricsService from './routes/MetricsService';
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
    this.express.disable('x-powered-by')
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
   this.express.use(basicAuth({
      authorizer: (user: string, password: string) => (password === 'password' && user === 'user')
  }));
  }

  // Configure API endpoints.
  private routes(): void {
    
    const router = express.Router();
    const metricsInstance = new metricsService.MetricsService();
    router.get('/', metricsInstance.metrics);
    const fullfilmentInstance = new fullfilmentService.FulfilmentService();
    router.post('/api', fullfilmentInstance.apiaiHandler);

    this.express.use('/', router);
  }

}

export default new App().express;