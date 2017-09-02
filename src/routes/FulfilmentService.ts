
import * as express from 'express';
import * as jsonpath from 'jsonpath';
import * as request from 'request'
import * as _ from 'lodash';
export class FulfilmentService {
  
  private static processService(requestOptions: request.Options, res: express.Response, speechTemplate: string): void {
    request(requestOptions, (error, response, body) => {
      if (error) {
        console.log(JSON.stringify(error));
        res.json({
          speech: 'Error from Service',
          displayText: 'Error from Service',
          source: 'Math Service'

        })
      } else {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          const speech = _.template(speechTemplate)({ body: body });

          res.json({
            speech: speech,
            displayText: speech,
            source: 'Math Service'

          })
        } else {
          console.log('Error' + JSON.stringify(response));
          res.json({
            speech: 'Invalid Response from Service',
            displayText: 'Invalid Response from Service',
            source: 'Math Service'

          })
        }
      }
    });
  }
  public apiaiHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
 
    const action: string = req.body.result.action;
    let requestOptions: request.Options = {
      method: 'POST',
      qs: {},
      headers: {},
      uri: 'https://mathservice.herokuapp.com',
      useQuerystring: false,
      json: true,
      body: {},
    };
    let msgTemplate = '';
    if (action === 'AddNumbers') {
      requestOptions.body = jsonpath.query(req.body, '$.result.parameters.number')[0];
      requestOptions.uri=requestOptions.uri+'/sum';
      msgTemplate = 'The total Amount is <%=body%>';
      FulfilmentService.processService(requestOptions, res, msgTemplate);
    } else if (action === 'maximum') {
      requestOptions.body = jsonpath.query(req.body, '$.result.parameters.number')[0];
      requestOptions.uri=requestOptions.uri+'/max';
      msgTemplate = 'The maximum Amount is <%=body%>';
      FulfilmentService.processService(requestOptions, res, msgTemplate);
     
    } else if (action === 'minimum') {
      requestOptions.body = jsonpath.query(req.body, '$.result.parameters.number')[0];
      requestOptions.uri=requestOptions.uri+'/min';
      msgTemplate = 'The minimum Amount is <%=body%>';
      FulfilmentService.processService(requestOptions, res, msgTemplate);
     
    } else if (action === 'pivalue') {
      requestOptions.method =  'GET';
      requestOptions.uri=requestOptions.uri+'/pi';
      msgTemplate = 'The value of PI is <%=body%>';
      FulfilmentService.processService(requestOptions, res, msgTemplate);
    }else if (action === 'power') {
      requestOptions.body = {
        "base": jsonpath.query(req.body, '$.result.parameters.base')[0],
        "power": jsonpath.query(req.body, '$.result.parameters.power')[0]
      };
      
      requestOptions.uri=requestOptions.uri+'/power';
      msgTemplate = 'The result is <%=body%>';
      FulfilmentService.processService(requestOptions, res, msgTemplate);
     
    }else if (action === 'sqrt') {
     
      
      requestOptions.uri=requestOptions.uri+'/sqrt/'+ jsonpath.query(req.body, '$.result.parameters.number')[0];
      
      msgTemplate = 'The result is <%=body%>';
      console.log('Test');
      FulfilmentService.processService(requestOptions, res, msgTemplate);
     
    }
    else {
      res.json({
        message: 'its working -' + req.body['result']['action'] + ' - '
        + req.body['result']['parameters']
      });
    }
  }

}
