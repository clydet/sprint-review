const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');

const {app, server} = require('../server');
const Review = require('../models/review');
const Participant = require('../models/participant');

const dummyReview = {
  owner: 'me',
  name: 'a sprint'
};

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
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

  it('should fail creation when review does not exist', () => {
    return request(app)
      .post('/participants')
      .send({
        reviewId: mongoose.Types.ObjectId().toString(),
        name: 'nope'
      })
      .expect(404);
  });

  describe('modify existing', () => {
    let participant;
    let update = {
      name: 'Mawp'
    }

    beforeEach((done) => {
      participant = new Participant({
        name: 'Meep'
      });
      participant.save().then(() => done());
    });

    it('should allow removal of participants', () => {
      return request(app)
        .delete(`/participants/${participant._id.toString()}`)
        .expect(204);
    });

    it('should fail removal of participant when nonexistent', () => {
      return request(app)
        .delete(`/participants/${mongoose.Types.ObjectId().toString()}`)
        .expect(404);
    });

    it('should fail update of participant when nonexistent', () => {
      return request(app)
        .put(`/participants/${mongoose.Types.ObjectId().toString()}`)
        .send(update)
        .expect(404);
    });

    it('should update participants valid attributes', () => {
      return request(app)
        .put(`/participants/${participant._id.toString()}`)
        .send(update)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(update);
        });
    });

    it('should update participants ignoring invalid attributes', () => {
      return request(app)
        .put(`/participants/${participant._id.toString()}`)
        .send(_.extend({what: 123}, update))
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(update);
          expect(res.body).not.toHaveProperty('what');
        });
    });
  });
});
