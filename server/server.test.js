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
        expect(res.body).toMatchObject({
          owner: 'me',
          name: 'a sprint',
          description: null,
          completed: false,
          completedTime: null
        });
      });
  });

  var failureScenario = (payload) => {
    return () => {
      return request(app)
        .post('/reviews')
        .send(payload)
        .expect(400)
        .expect((res) => {
          expect(res.body._message).toBe('Review validation failed');
        });
    };
  };

  var scenarios = [{
    name: 'should bomb when missing owner',
    fn: failureScenario({name: 'a sprint'})
  },{
    name: 'should bomb when empty owner',
    fn: failureScenario({owner: ''})
  },{
    name: 'should bomb when whitespace for owner',
    fn: failureScenario({owner: '    '})
  },{
    name: 'should bomb when missing name',
    fn: failureScenario({owner: 'me'})
  },{
    name: 'should bomb when empty name',
    fn: failureScenario({name: ''})
  },{
    name: 'should bomb when whitespace for name',
    fn: failureScenario({name: '    '})
  }];

  scenarios.forEach(scenario => it(scenario.name, scenario.fn));
});
