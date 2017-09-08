
import * as express from 'express';
import * as jsonpath from 'jsonpath';
import * as request from 'request'
import * as _ from 'lodash';
import * as config from './../RoutingConfig/Config';
export class FulfilmentService {

  private static processService(requestOptions: request.Options, res: express.Response, speechTemplate: string, serviceName: string): void {
    request(requestOptions, (error, response, body) => {
      if (error) {
        console.log('ABCD',JSON.stringify(requestOptions),);
        res.json({
          speech: 'Error from Service',
          displayText: 'Error from Service',
          source: 'Router'

        })
      } else {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          const speech = _.template(speechTemplate)({ body: body });
          console.log('Sucess' + JSON.stringify(response));
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
   // const configData = (<any>require('./../config.json'));
    const routeMap = (new config.ConfigManager('./../config.json')).serviceRouteMap
    const action: string = req.body.result.action;

    let msgTemplate = '';
    const routeDetail = routeMap[action];
    if (routeDetail) {
      let body: any;

      if (routeDetail.inputPath) {
      
          body = jsonpath.query(req.body, routeDetail.inputPath)[0];
       

      } else if (routeDetail.multiInput){
        body = {};
        for (const key in routeDetail.multiInput) {
          body[key] = jsonpath.query(req.body, routeDetail.multiInput[key])[0];
        }
      }
       else {
        body = {};
      }

      var uri = routeDetail.service.baseURL + routeDetail.path;
      console.log('uri',uri)
      if (routeDetail.urlAppend) {
        uri = uri + '/' + jsonpath.query(req.body, routeDetail.urlAppend)[0];
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

      FulfilmentService.processService(requestOptions, res, routeDetail.msgTemplate, routeDetail.service.name);
    } else {
      res.json({
        message: 'Unable to Find Router for' + req.body.result.action
      });
    }


  }

}
