import request from 'supertest';
import { app } from '../../../src/api/app';

describe('GET /health', () => {
  it('respond with OK', (done) => {
    request(app).get('/').expect('Content-Type', /json/).expect(200, done);
  });
});
