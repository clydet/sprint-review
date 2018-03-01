const Review = require('./../models/review');
const Participant = require('./../models/participant');
const _ = require('lodash');

function create(req, res) {
  var id = req.body.reviewId;

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
}

module.exports = {
  create
}
