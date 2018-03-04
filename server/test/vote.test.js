const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');

const {app, server} = require('../server');
const Review = require('../models/review');
const Issue = require('../models/issue');
const Participant = require('../models/participant');
const Vote = require('../models/vote');

const dummyReview = {
  owner: 'me',
  name: 'a sprint'
};

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
});

describe.only('#votes', () => {
  let issue;
  let participant;

  beforeEach((done) => {
    let review = new Review(dummyReview);
    issue = new Issue({content: 'meep mawp'});
    participant = new Participant({name: 'Mitra'});
    review.issues.push(issue);
    Promise.all([issue.save(), review.save(), participant.save()])
      .then(() => done());
  });

  it('should record votes', () => {
    return request(app)
      .post(`/issues/${issue._id.toString()}/users/${participant._id.toString()}`)
      .expect(200)
      .expect((res) => {
        Issue.findById(issue._id)
          .then((found) => expect(found.voteCount).toEqual(1));
      });
  });

  it('should fail creation when issue does not exist', () => {
    return request(app)
      .post(`/issues/${mongoose.Types.ObjectId().toString()}/users/${participant._id.toString()}`)
      .expect(404);
  });

  it('should fail creation when user does not exist', () => {
    return request(app)
      .post(`/issues/${issue._id.toString()}/users/${mongoose.Types.ObjectId().toString()}`)
      .expect(404);
  });

  describe('deletion', () => {
    let vote

    beforeEach((done) => {
      vote = new Vote({
        participant: participant._id,
        issue: issue._id
      });
      issue.votes.push(vote);
      Promise.all([vote.save(), issue.save()])
        .then(() => done());
    });

    it('should delete existing votes', () => {
      return request(app)
        .delete(`/votes/${vote._id.toString()}`)
        .expect(204);
    });

    it('should fail deletion of nonexisting votes', () => {
      return request(app)
        .delete(`/votes/${mongoose.Types.ObjectId().toString()}`)
        .expect(404);
    });
  });
});
