const request = require('supertest');
const app = require('./server').app;

describe('health check', () => {
  it('should be healthy', () => {
    return request(app)
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('all clear');
      });
  });
});

describe('non existent route', () => {
  it('should be healthy', () => {
    return request(app)
      .get('/healthmeep')
      .expect(404);
  });
});
