const request = require('supertest');
const server = require('./server');

afterAll(async () => {
  await server.server.close();
});

describe('health check', () => {
  it('should be healthy', () => {
    return request(server.app)
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('all clear');
      });
  });
});

describe('non existent route', () => {
  it('should be healthy', () => {
    return request(server.app)
      .get('/healthmeep')
      .expect(404);
  });
});
