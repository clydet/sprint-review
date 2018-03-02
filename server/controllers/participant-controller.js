const Review = require('./../models/review');
const Participant = require('./../models/participant');
const _ = require('lodash');

function create(req, res) {
  let id = req.body.reviewId;

  Review.findById(id).then((review) => {
    if (!review) {
      return res.status(404).send();
    }
    let participant = new Participant(_.omit(req.body, ['reviewId']));
    review.participants.push(participant);
    review.save().then((saved) => {
      res.send(saved);
    });
  });
};

function remove(req, res) {
  let id = req.params.id;

  Participant.findById(id).then((participant) => {
    if (!participant) {
      return res.status(404).send();
    }
    participant.remove()
      .then(() => res.status(204).send());
  });
};

function update(req, res) {
  let id = req.params.id;
  let keys = _.keys(Participant.schema.obj);
  let changeSet = _.pick(req.body, keys);

  Participant.findByIdAndUpdate(id, changeSet, {new: true})
    .then((participant) => {
      if (participant === null) {
        return res.status(404).send();
      }
      res.status(200).send(participant);
    });
};

module.exports = {
  create,
  update,
  remove
}
