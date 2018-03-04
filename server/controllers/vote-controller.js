const _ = require('lodash');

const Vote = require('./../models/vote');
const Issue = require('./../models/issue');
const Participant = require('./../models/participant');

function create(req, res) {
  let {issueId, userId} = req.params;

  Participant.findById(userId)
    .then((participant) => {
      if (!participant) {
        throw('User does not exist');
      }
      return Issue.findById(issueId);
    }).then((issue) => {
      if (!issue) {
        throw('Issue does not exist')
      }
      let vote = new Vote({
        participant: userId,
        issue: issueId
      });
      issue.votes.push(vote);
      issue.save().then((saved) => {
        res.send(saved);
      })
    }).catch((err) => {
      res.status(404).send();
    });
};

function remove(req, res) {
  let voteId = req.params.voteId;

  Vote.findByIdAndRemove(voteId)
    .then((vote) => {
      if (!vote) {
        return res.status(404).send();
      }
      res.status(204).send();
    });
};

module.exports = {
  create,
  remove
}
