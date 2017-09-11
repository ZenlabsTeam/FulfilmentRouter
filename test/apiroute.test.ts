import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
interface TestDetails{
    [key: string]: {
        expectedText:string,
        input:any
    }
}
describe('API Route', function() {
    this.timeout(75000);
    const testData = <TestDetails>require('../test/APIServiceTest.json');
    for(const key in testData) {
     
      it(key, done  => {
         
        chai.request(app).post('/api')
        .send(testData[key].input)
        .auth('user','password')
        .end((err, res) => {
          expect(res.status).to.eql(200);
          expect(res.type).to.eql('application/json');
          expect(res.body.speech).to.eql(testData[key].expectedText);
          expect(res.body.displayText).to.eql(testData[key].expectedText);
          expect(res.body.source).to.eql('MathService');
         
          done();
        });
      });
    
    }
    
    });