
import * as express from 'express';
import * as jsonpath from 'jsonpath';
import * as request from 'request-promise'
import * as _ from 'lodash';
import * as config from './../RoutingConfig/ConfigManager';
export interface RouterOutput {
  speech: string,
  displayText: string,
  source: string
}
export interface RouterInput {
  result: {
    action: string,
    parameters: {
      [key: string]: any
    }
  };
}
export class FulfilmentService {

  private static processService(requestOptions: request.Options, speechTemplate: string, serviceName: string): Promise<RouterOutput> {

    return new Promise((resolve, reject) => {
      request(requestOptions).then((body) => {
        const speech = _.template(speechTemplate)({ body: body });
        resolve({
          speech: speech,
          displayText: speech,
          source: serviceName
        });
      }).catch((error) => {
        resolve({
          speech: 'Error from Service',
          displayText: 'Error from Service',
          source: 'Router'

        });
      });
    });

  }
  public static routeHandler(routerInput: RouterInput): Promise<RouterOutput> {
    return new Promise((resolve, reject) => {
      const serviceActionMap = (new config.ConfigManager('./../config.json')).serviceActionMap;
      const routeMap = serviceActionMap.routes;
      const routeDetail = routeMap[routerInput.result.action];
      if (routeDetail) {
        let body: any = {};

        if (routeDetail.inputPath) {
          body = jsonpath.query(routerInput, routeDetail.inputPath)[0];
        } else if (routeDetail.multiInput) {
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
        const rv = FulfilmentService.processService(requestOptions, routeDetail.msgTemplate, routeDetail.serviceName);
        rv.then(value => resolve(value));


      } else {
        let speech = 'Unable to Find Router for' + routerInput.result.action;
        resolve({
          speech: speech,
          displayText: speech,
          source: routerInput.result.action
        });
      }
    });
  }
  public apiaiHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const rv = FulfilmentService.routeHandler(<RouterInput>req.body);
    rv.then(value => res.status(200)
      .json(value).end());

  }

}
