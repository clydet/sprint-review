const request = require('supertest');
const {app, server, mongoose} = require('./server');

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
});

describe('#health', () => {
  it('should be healthy', () => {
    return request(app)
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('all clear');
      });
  });

  it('should express confusion when health is not correctly checked', () => {
    return request(app)
      .get('/healthmeep')
      .expect(404);
  });
});

describe('#reviews', () => {
  it('should create new reviews', () => {
    return request(app)
      .post('/reviews')
      .send({
        owner: 'me',
        name: 'a sprint'
      })
      .expect(200)
      .expect((res) => {
        console.log("Response:", res.body);
        expect(res.body).toMatchObject({
          owner: 'me',
          name: 'a sprint',
          description: null,
          completed: false,
          completedTime: null
        });
      });
  })
});
