
import * as express from 'express';
import * as jsonpath from 'jsonpath';
import * as request from 'request'

export class FulfilmentService{

    public apiaiHandler(req: express.Request, res: express.Response, next: express.NextFunction):void{
        console.log(JSON.stringify(req.body))
        const action: string = jsonpath.query(req.body, '$.result.action')[0];
        console.log(JSON.stringify(action));
        if (action === 'AddNumbers' ) {
          const nums = jsonpath.query(req.body, '$.result.parameters.a')[0];
          console.log(JSON.stringify(nums));
          let requestOptions: request.Options = {
            method: 'POST',
            qs: {},
            headers: {},
            uri: 'https://mathservice.herokuapp.com/sum',
            useQuerystring: false,
            json: true,
            body: nums,
          };
          request(requestOptions, (error, response, body) => {
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
        }
        else {
          res.json({
            message: 'its working -' + req.body['result']['action'] + ' - '
            + req.body['result']['parameters']
          });
        }
    }
}
