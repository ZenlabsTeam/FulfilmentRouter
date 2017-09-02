
import * as express from 'express';
import * as jsonpath from 'jsonpath';
import * as request from 'request'
import * as _ from 'lodash';
export class FulfilmentService {
  private testPrint(): void {
    console.log('testPrint');
  }
  private processService(requestOptions: request.Options, res: express.Response, speechTemplate: string): void {
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
    this.testPrint();
    console.log(JSON.stringify(req.body))
    const action: string = req.body.result.action;

    if (action === 'AddNumbers') {
      const nums = jsonpath.query(req.body, '$.result.parameters.number')[0];
      console.log('Nums:' + JSON.stringify(nums));
      let requestOptions: request.Options = {
        method: 'POST',
        qs: {},
        headers: {},
        uri: 'https://mathservice.herokuapp.com/sum',
        useQuerystring: false,
        json: true,
        body: nums,
      };
      console.log(action);
      this.processService(requestOptions, res, 'The total Amount is <%=body%>');
    } else if (action === 'maximum') {
      const nums = jsonpath.query(req.body, '$.result.parameters.number')[0];
      console.log(JSON.stringify(nums));
      let requestOptions: request.Options = {
        method: 'POST',
        qs: {},
        headers: {},
        uri: 'https://mathservice.herokuapp.com/max',
        useQuerystring: false,
        json: true,
        body: nums,
      };
      this.processService(requestOptions, res, 'The maximum Amount is <%=body%>');
    } else if (action === 'minimum') {
      const nums = jsonpath.query(req.body, '$.result.parameters.number')[0];
      console.log(JSON.stringify(nums));
      let requestOptions: request.Options = {
        method: 'POST',
        qs: {},
        headers: {},
        uri: 'https://mathservice.herokuapp.com/min',
        useQuerystring: false,
        json: true,
        body: nums,
      };
      this.processService(requestOptions, res, 'The minimum Amount is <%=body%>');
    } else if (action === 'pivalue') {

      let requestOptions: request.Options = {
        method: 'GET',
        qs: {},
        headers: {},
        uri: 'https://mathservice.herokuapp.com/pi',
        useQuerystring: false,
        json: true,
        body: {},
      };
      this.processService(requestOptions, res, 'The value of PI is <%=body%>');
    }
    else {
      res.json({
        message: 'its working -' + req.body['result']['action'] + ' - '
        + req.body['result']['parameters']
      });
    }
  }

}
