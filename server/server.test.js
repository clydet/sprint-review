const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');

const {app, server} = require('./server');
const Review = require('./models/review');

const dummyReview = {
  owner: 'me',
  name: 'a sprint'
};

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
      .send(dummyReview)
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

  describe('delete', () => {
    let review;

    beforeEach((done) => {
      review = new Review(dummyReview);
      review.save().then(() => done());
    });

    it('should remove reviews', () => {
      return request(app)
        .delete(`/reviews/${review._id.toString()}`)
        .expect(204);
    });

    it('should fail remove when invalid id', () => {
      let nonExistent = mongoose.Types.ObjectId().toString();
      return request(app)
        .delete(`/reviews/${nonExistent}`)
        .expect(404);
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

describe('#participants', () => {
  let review;

  beforeEach((done) => {
    review = new Review(dummyReview);
    review.save().then(() => done());
  });

  it('should create new participants', () => {
    return request(app)
      .post('/participants')
      .send({
        reviewId: review._id.toString(),
        name: 'Mitra'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.participants[0]).toMatchObject({
          name: 'Mitra'
        });
      });
  });

  it('should fail when review does not exist', () => {
    return request(app)
      .post('/participants')
      .send({
        reviewId: mongoose.Types.ObjectId().toString(),
        name: 'nope'
      })
      .expect(404);
  });
});
