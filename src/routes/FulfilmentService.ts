
import * as express from 'express';
import * as jsonpath from 'jsonpath';
import * as request from 'request'
import * as _ from 'lodash';
import * as config from './../RoutingConfig/ConfigManager';
export interface  RouterInput{
  result: {
    action:string,
    parameters: {
      [key: string]: any
    }
  };
}
export class FulfilmentService {

  private static processService(requestOptions: request.Options, res: express.Response, speechTemplate: string, serviceName: string): void {
    request(requestOptions, (error, response, body) => {
      if (error) {
        res.json({
          speech: 'Error from Service',
          displayText: 'Error from Service',
          source: 'Router'

        })
      } else {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          const speech = _.template(speechTemplate)({ body: body });
          res.json({
            speech: speech,
            displayText: speech,
            source: serviceName

          })
        } else {
          console.log('Error' + JSON.stringify(response));
          res.json({
            speech: 'Invalid Response from Service',
            displayText: 'Invalid Response from Service',
            source: serviceName

          })
        }
      }
    });
  }
  
  public apiaiHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {

    const serviceActionMap = (new config.ConfigManager('./../config.json')).serviceActionMap
    const routeMap =serviceActionMap.routes;
    const routerInput =<RouterInput>req.body;

    const routeDetail = routeMap[routerInput.result.action];
    if (routeDetail) {
      let body: any ={};

      if (routeDetail.inputPath) {
          body = jsonpath.query(routerInput, routeDetail.inputPath)[0];
       } else if (routeDetail.multiInput){
        for (const key in routeDetail.multiInput) {
          body[key] = jsonpath.query(routerInput, routeDetail.multiInput[key])[0];
        }
      }
      

      var uri = serviceActionMap.services[routeDetail.serviceName].baseURL + routeDetail.path;
      if (routeDetail.urlAppend) {
        uri = uri + '/' + jsonpath.query(routerInput, routeDetail.urlAppend)[0];
      }
      const requestOptions: request.Options = {
        method: routeDetail.method,
        qs: {},
        headers: {},
        uri: uri,
        useQuerystring: false,
        json: true,
        body: body,
      };

      FulfilmentService.processService(requestOptions, res, routeDetail.msgTemplate, routeDetail.serviceName);
    } else {
      res.json({
        message: 'Unable to Find Router for' + req.body.result.action
      });
    }


  }

}
