const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');

const {app, server} = require('../server');
const Review = require('../models/review');

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
  let review;

  beforeEach((done) => {
    review = new Review(dummyReview);
    review.save().then(() => done());
  });

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

  describe('update', () => {
    let update = {
      owner: 'meep',
      name: 'mawp',
      description: 'meep mawp'
    };

    it('should update reviews valid attributes', () => {
      return request(app)
        .put(`/reviews/${review._id.toString()}`)
        .send(update)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(update);
        });
    });

    it('should update reviews ignoring invalid attributes', () => {
      return request(app)
        .put(`/reviews/${review._id.toString()}`)
        .send(_.extend({what: 123}, update))
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(update);
          expect(res.body).not.toHaveProperty('what');
        });
    });

    it('should fail review update if invalid id', () => {
      return request(app)
        .put(`/reviews/${mongoose.Types.ObjectId().toString()}`)
        .send(update)
        .expect(404);
    });
  });

  describe('delete', () => {

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
