const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');

const {app, server} = require('../server');
const Review = require('../models/review');
const Issue = require('../models/issue');

const dummyReview = {
  owner: 'me',
  name: 'a sprint'
};

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
});

describe('#issues', () => {
  let review;

  beforeEach((done) => {
    review = new Review(dummyReview);
    review.save().then(() => done());
  });

  it('should create new issues', () => {
    return request(app)
      .post('/issues')
      .send({
        reviewId: review._id.toString(),
        content: 'This is the issue content'
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.issues[0]).toMatchObject({
          content: 'This is the issue content'
        });
      });
  });

  it('should fail creation when review does not exist', () => {
    return request(app)
      .post(`/reviews/${mongoose.Types.ObjectId().toString()}/issues`)
      .send({
        content: 'nope'
      })
      .expect(404);
  });

  describe('modify existing', () => {
    let issue;
    let update = {
      content: 'Mawp'
    }

    beforeEach((done) => {
      issue = new Issue({
        content: 'Meep'
      });
      issue.save().then(() => done());
    });

    it('should allow removal of issues', () => {
      return request(app)
        .delete(`/issues/${issue._id.toString()}`)
        .expect(204);
    });

    it('should fail removal of issue when nonexistent', () => {
      return request(app)
        .delete(`/issues/${mongoose.Types.ObjectId().toString()}`)
        .expect(404);
    });

    it('should fail update of issue when nonexistent', () => {
      return request(app)
        .put(`/issues/${mongoose.Types.ObjectId().toString()}`)
        .send(update)
        .expect(404);
    });

    it('should update issues valid attributes', () => {
      return request(app)
        .put(`/issues/${issue._id.toString()}`)
        .send(update)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(update);
        });
    });

    it('should update issues ignoring invalid attributes', () => {
      return request(app)
        .put(`/issues/${issue._id.toString()}`)
        .send(_.extend({what: 123}, update))
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(update);
          expect(res.body).not.toHaveProperty('what');
        });
    });
  });
});
