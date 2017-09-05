import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('baseRoute', () => {

  it('should be json', done  => {
    chai.request(app).get('/').auth('user','password')
    .end((err, res) => {
      expect(res.type).to.eql('application/json');
      done();
    });
  });

  it('should have a message prop', done => {
    chai.request(app).get('/').auth('user','password')
    .end((err, res) => {
      expect(res.body.status).to.eql('UP');
      done()
    });
  });

});